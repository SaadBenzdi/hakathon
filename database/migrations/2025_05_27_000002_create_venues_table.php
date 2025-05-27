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
        Schema::create('venues', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['sport', 'conference', 'party']); // Type of venue
            $table->integer('capacity');
            $table->decimal('price', 10, 2); // Price per hour
            $table->string('location');
            $table->json('amenities')->nullable(); // List of amenities as JSON
            $table->text('description')->nullable();
            $table->string('image_url')->nullable();
            $table->enum('status', ['active', 'maintenance', 'inactive'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('venues');
    }
};
