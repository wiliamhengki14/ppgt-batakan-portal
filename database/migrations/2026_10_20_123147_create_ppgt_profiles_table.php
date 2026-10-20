<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ppgt_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete()->cascadeOnUpdate();
            $table->enum('residence_type', ['lokal_batakan', 'perantau']);
            $table->enum('gender', ['L', 'P']);
            $table->date('birth_date');
            $table->string('sector_in_batakan');
            $table->text('batakan_home_address');
            $table->string('parents_name');

            $table->string('overseas_city')->nullable();
            $table->text('overseas_address')->nullable();
            $table->enum('overseas_purpose', ['pendidikan', 'kerja', 'lainnya'])->nullable();

            $table->enum('verification_status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('rejection_note')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ppgt_profiles');
    }
};
