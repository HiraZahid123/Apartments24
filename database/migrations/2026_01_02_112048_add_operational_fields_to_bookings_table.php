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
        Schema::table('bookings', function (Blueprint $table) {
            $table->integer('number_of_guests')->default(1)->after('check_out_date');
            $table->string('preferred_language')->default('en')->after('number_of_guests');
            $table->string('checkin_token')->unique()->nullable()->after('preferred_language');
            $table->boolean('checkin_form_sent')->default(false)->after('checkin_token');
            $table->timestamp('checkin_form_sent_at')->nullable()->after('checkin_form_sent');
            $table->boolean('is_checked_in')->default(false)->after('checkin_form_sent_at');
            $table->timestamp('checked_in_at')->nullable()->after('is_checked_in');
            $table->boolean('is_checked_out')->default(false)->after('checked_in_at');
            $table->timestamp('checked_out_at')->nullable()->after('is_checked_out');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn([
                'number_of_guests',
                'preferred_language',
                'checkin_token',
                'checkin_form_sent',
                'checkin_form_sent_at',
                'is_checked_in',
                'checked_in_at',
                'is_checked_out',
                'checked_out_at'
            ]);
        });
    }
};
