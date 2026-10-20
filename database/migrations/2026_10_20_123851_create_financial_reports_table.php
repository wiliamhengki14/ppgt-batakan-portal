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
        Schema::create('financial_reports', function (Blueprint $table) {
            $table->id();
            $table->string('report_member')->unique();
            $table->string('title');
            $table->date('period_start');
            $table->date('period_end');
            $table->decimal('total_income', 12, 2)->default(0);
            $table->decimal('total_expense', 12, 2)->default(0);
            $table->decimal('ending_balance', 12, 2)->default(0);
            $table->enum('status', ['draft', 'submitted_to_church', 'verified_by_church'])->default('draft');
            $table->text('verification_notes')->nullable();
            $table->string('generated_pdf_path')->nullable();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('financial_reports');
    }
};
