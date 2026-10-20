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
        Schema::create('schedule_rosters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('schedule_id')->constrained('worship_schedules')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete()->cascadeOnUpdate();
            $table->enum('role_name', ['penghimpun', 'pemusik', 'liturgis', 'mc', 'pelayan_firman']);
            $table->string('custom_name')->nullable();
            $table->boolean('is_auto_assigned')->default(false);
            $table->boolean('reminder_sent_h3')->default(false);
            $table->boolean('reminder_sent_h1')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedule_rosters');
    }
};
