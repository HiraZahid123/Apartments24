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
        Schema::table('apartments', function (Blueprint $table) {
            if (!Schema::hasColumn('apartments', 'instructions_et')) {
                $table->text('instructions_et')->nullable()->after('instructions');
            }
            if (!Schema::hasColumn('apartments', 'instructions_ru')) {
                $table->text('instructions_ru')->nullable()->after('instructions_et');
            }
            if (!Schema::hasColumn('apartments', 'arrival_url_et')) {
                $table->string('arrival_url_et')->nullable()->after('arrival_url');
            }
            if (!Schema::hasColumn('apartments', 'arrival_url_ru')) {
                $table->string('arrival_url_ru')->nullable()->after('arrival_url_et');
            }
            if (!Schema::hasColumn('apartments', 'wifi_ssid')) {
                $table->string('wifi_ssid')->nullable()->after('keybox_code');
            }
            if (!Schema::hasColumn('apartments', 'wifi_password')) {
                $table->string('wifi_password')->nullable()->after('wifi_ssid');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('apartments', function (Blueprint $table) {
            $table->dropColumn([
                'instructions_et',
                'instructions_ru',
                'arrival_url_et',
                'arrival_url_ru',
                'wifi_ssid',
                'wifi_password'
            ]);
        });
    }
};
