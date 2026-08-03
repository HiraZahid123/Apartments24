<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE automated_message_logs MODIFY COLUMN message_type ENUM('guest_registration', 'welcome', 'thank_you', 'checkout_reminder', 'invoice') NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE automated_message_logs MODIFY COLUMN message_type ENUM('guest_registration', 'welcome', 'thank_you', 'checkout_reminder') NOT NULL");
    }
};
