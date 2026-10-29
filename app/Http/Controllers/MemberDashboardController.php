<?php

namespace App\Http\Controllers;

use App\Models\PpgtProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MemberDashboardController extends Controller
{
    /**
     * Tampilkan formulir sensus profil anggota.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $user->load('profile');

        return Inertia::render('SensusProfile', [
            'profile' => $user?->profile,
        ]);
    }

    /**
     * Simpan atau perbarui data sensus anggota.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'residence_type' => ['required', 'in:lokal_batakan,perantau'],
            'gender' => ['required', 'in:L,P'],
            'birth_date' => ['required', 'date', 'before_or_equal:today'],
            'sector_in_batakan' => ['required', 'string', 'max:100'],
            'batakan_home_address' => ['required', 'string', 'max:500'],
            'parent_names' => ['required', 'string', 'max:255'],
            'talents' => ['nullable', 'array'],
            'talents.*' => ['string', 'max:100'],
            'photo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],

            // Field perantau
            'overseas_city' => ['nullable', 'required_if:residence_type,perantau', 'string', 'max:100'],
            'overseas_address' => ['nullable', 'required_if:residence_type,perantau', 'string', 'max:500'],
            'overseas_purpose' => ['nullable', 'required_if:residence_type,perantau', 'in:kuliah,pendidikan,kerja,lainnya'],
            'church_at_overseas' => ['nullable', 'string', 'max:255'],
            'return_plan' => ['nullable', 'string', 'max:100'],
        ], [
            'required_if' => ':attribute wajib diisi bagi anggota dengan domisili perantau.',
            'before_or_equal' => ':attribute tidak boleh melebihi tanggal hari ini.',
            'photo.image' => 'File harus berupa gambar.',
            'photo.max' => 'Ukuran foto maksimal 2MB.',
        ], [
            'residence_type' => 'Status domisili',
            'gender' => 'Jenis kelamin',
            'birth_date' => 'Tanggal lahir',
            'sector_in_batakan' => 'Sektor di Batakan',
            'batakan_home_address' => 'Alamat rumah di Batakan',
            'parent_names' => 'Nama orang tua',
            'talents' => 'Talenta & minat pelayanan',
            'photo' => 'Foto profil',
            'overseas_city' => 'Kota perantauan',
            'overseas_address' => 'Alamat di perantauan',
            'overseas_purpose' => 'Tujuan merantau',
            'church_at_overseas' => 'Gereja di perantauan',
            'return_plan' => 'Rencana kepulangan',
        ]);

        $user = $request->user();

        // Handle profile photo upload
        if ($request->hasFile('photo')) {
            if ($user->profile_photo_path && Storage::disk('public')->exists($user->profile_photo_path)) {
                Storage::disk('public')->delete($user->profile_photo_path);
            }
            $photoPath = $request->file('photo')->store('profile-photos', 'public');
            $user->update(['profile_photo_path' => $photoPath]);
        }

        if ($validated['residence_type'] === 'lokal_batakan') {
            $validated['overseas_city'] = null;
            $validated['overseas_address'] = null;
            $validated['overseas_purpose'] = null;
            $validated['church_at_overseas'] = null;
            $validated['return_plan'] = null;
        } elseif (isset($validated['overseas_purpose']) && $validated['overseas_purpose'] === 'kuliah') {
            $validated['overseas_purpose'] = 'pendidikan';
        }

        // Reset verification status and duty eligibility on profile changes
        $validated['verification_status'] = 'pending';
        $validated['verified_by'] = null;
        $validated['verified_at'] = null;
        $user->update(['is_eligible_for_duty' => false]);

        // Remove photo from profile attributes before updating ppgt_profiles
        unset($validated['photo']);

        PpgtProfile::updateOrCreate(
            ['user_id' => $user->id],
            $validated,
        );

        return Redirect::back();
    }

    public function updateElgible(Request $request): RedirectResponse
    {
        $user = $request->user();
        $user->update([
            'is_eligible_for_duty' => ! $user->is_eligible_for_duty,
        ]);

        return Redirect::back();
    }
}
