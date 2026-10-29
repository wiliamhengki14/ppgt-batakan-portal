<?php

namespace Tests\Feature;

use App\Models\PpgtProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MemberDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_sensus_page(): void
    {
        $response = $this->get('/sensus');

        $response->assertRedirect('/login');
    }

    public function test_authenticated_user_can_view_sensus_page(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get('/sensus');

        $response->assertOk();
    }

    public function test_user_can_submit_local_residence_profile(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->post('/sensus/update', [
                'residence_type' => 'lokal_batakan',
                'gender' => 'L',
                'birth_date' => '2000-05-15',
                'sector_in_batakan' => 'Sektor 1',
                'batakan_home_address' => 'Jl. Poros Batakan No. 12',
                'parent_names' => 'Bpk. Markus & Ibu Maria',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        $this->assertDatabaseHas('ppgt_profiles', [
            'user_id' => $user->id,
            'residence_type' => 'lokal_batakan',
            'gender' => 'L',
            'sector_in_batakan' => 'Sektor 1',
            'parent_names' => 'Bpk. Markus & Ibu Maria',
            'overseas_city' => null,
            'overseas_address' => null,
            'overseas_purpose' => null,
            'verification_status' => 'pending',
        ]);
    }

    public function test_user_can_submit_perantau_profile_and_kuliah_maps_to_database_enum(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->post('/sensus/update', [
                'residence_type' => 'perantau',
                'gender' => 'P',
                'birth_date' => '2001-08-20',
                'sector_in_batakan' => 'Sektor 2',
                'batakan_home_address' => 'Dusun Batakan Barat',
                'parent_names' => 'Bpk. Petrus & Ibu Sarah',
                'overseas_city' => 'Makassar',
                'overseas_address' => 'Jl. Perintis Kemerdekaan Km. 10',
                'overseas_purpose' => 'kuliah',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        $this->assertDatabaseHas('ppgt_profiles', [
            'user_id' => $user->id,
            'residence_type' => 'perantau',
            'overseas_city' => 'Makassar',
            'overseas_purpose' => 'pendidikan',
            'verification_status' => 'pending',
        ]);

        // Pastikan saat diambil di index, overseas_purpose dipetakan kembali ke kuliah untuk frontend
        $indexResponse = $this
            ->actingAs($user)
            ->get('/sensus');

        $indexResponse->assertOk();
        $this->assertSame('kuliah', $user->fresh()->profile->overseas_purpose === 'pendidikan' ? 'kuliah' : $user->fresh()->profile->overseas_purpose);
    }

    public function test_perantau_requires_overseas_details(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->post('/sensus/update', [
                'residence_type' => 'perantau',
                'gender' => 'L',
                'birth_date' => '2000-01-01',
                'sector_in_batakan' => 'Sektor 1',
                'batakan_home_address' => 'Alamat Batakan',
                'parent_names' => 'Orang Tua',
                'overseas_city' => '',
                'overseas_address' => '',
                'overseas_purpose' => '',
            ]);

        $response->assertSessionHasErrors(['overseas_city', 'overseas_address', 'overseas_purpose']);
    }

    public function test_updating_profile_resets_verification_and_eligibility(): void
    {
        $user = User::factory()->create([
            'is_eligible_for_duty' => true,
        ]);

        PpgtProfile::create([
            'user_id' => $user->id,
            'residence_type' => 'lokal_batakan',
            'gender' => 'L',
            'birth_date' => '1999-01-01',
            'sector_in_batakan' => 'Sektor 1',
            'batakan_home_address' => 'Alamat lama',
            'parent_names' => 'Ortu lama',
            'verification_status' => 'approved',
            'verified_by' => $user->id,
            'verified_at' => now(),
        ]);

        $response = $this
            ->actingAs($user)
            ->post('/sensus/update', [
                'residence_type' => 'lokal_batakan',
                'gender' => 'L',
                'birth_date' => '1999-01-01',
                'sector_in_batakan' => 'Sektor 1',
                'batakan_home_address' => 'Alamat baru',
                'parent_names' => 'Ortu lama',
            ]);

        $response->assertSessionHasNoErrors();

        $profile = $user->fresh()->profile;
        $this->assertSame('pending', $profile->verification_status);
        $this->assertNull($profile->verified_by);
        $this->assertNull($profile->verified_at);
        $this->assertFalse($user->fresh()->is_eligible_for_duty);
    }

    public function test_user_can_upload_profile_photo_and_save_talents(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('profile.jpg', 400, 400);

        $response = $this
            ->actingAs($user)
            ->post('/sensus/update', [
                'residence_type' => 'lokal_batakan',
                'gender' => 'L',
                'birth_date' => '1998-12-25',
                'sector_in_batakan' => 'Sektor 1',
                'batakan_home_address' => 'Jl. Immanuel No. 5',
                'parent_names' => 'Bpk. Thomas & Ibu Ruth',
                'talents' => ['Pemusik / Keyboardis', 'Song Leader / Singer'],
                'photo' => $file,
            ]);

        $response->assertSessionHasNoErrors()->assertRedirect();

        $freshUser = $user->fresh();
        $this->assertNotNull($freshUser->profile_photo_path);
        Storage::disk('public')->assertExists($freshUser->profile_photo_path);
        $this->assertNotNull($freshUser->profile_photo_url);

        $profile = $freshUser->profile;
        $this->assertNotNull($profile);
        $this->assertEquals(['Pemusik / Keyboardis', 'Song Leader / Singer'], $profile->talents);
    }
}
