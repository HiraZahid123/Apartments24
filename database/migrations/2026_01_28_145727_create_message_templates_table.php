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
        Schema::create('message_templates', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['guest_registration', 'welcome', 'thank_you', 'checkout_reminder']);
            $table->enum('language', ['en', 'et', 'ru']);
            $table->string('subject');
            $table->text('content');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Unique constraint: one template per type per language
            $table->unique(['type', 'language']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('message_templates');
    }
};
