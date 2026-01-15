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
        Schema::table('guest_checkins', function (Blueprint $table) {
            $table->string('first_name')->after('booking_id')->nullable();
            $table->string('last_name')->after('first_name')->nullable();
            $table->date('date_of_birth')->after('last_name')->nullable();
            $table->string('nationality')->after('date_of_birth')->nullable();
            $table->string('document_type')->after('nationality')->nullable(); // passport, id_card, etc.
            $table->string('document_number')->after('document_type')->nullable();
            $table->longText('signature_data')->after('document_number')->nullable(); // base64 signature
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('guest_checkins', function (Blueprint $table) {
            $table->dropColumn([
                'first_name',
                'last_name',
                'date_of_birth',
                'nationality',
                'document_type',
                'document_number',
                'signature_data'
            ]);
        });
    }
};
