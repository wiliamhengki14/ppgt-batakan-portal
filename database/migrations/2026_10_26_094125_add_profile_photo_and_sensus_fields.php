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
        Schema::table('users', function (Blueprint $table) {
            $table->string('profile_photo_path', 2048)->nullable()->after('phone_number');
        });

        Schema::table('ppgt_profiles', function (Blueprint $table) {
            $table->json('talents')->nullable()->after('parent_names');
            $table->string('church_at_overseas')->nullable()->after('overseas_purpose');
            $table->string('return_plan')->nullable()->after('church_at_overseas');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ppgt_profiles', function (Blueprint $table) {
            $table->dropColumn(['talents', 'church_at_overseas', 'return_plan']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('profile_photo_path');
        });
    }
};
