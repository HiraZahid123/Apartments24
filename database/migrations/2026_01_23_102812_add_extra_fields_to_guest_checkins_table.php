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
            $table->string('phone_number', 20)->nullable()->after('nationality');
            $table->enum('purpose_of_travel', ['vacation', 'business', 'other'])->nullable()->after('phone_number');
            $table->unsignedTinyInteger('number_of_minors')->nullable()->after('purpose_of_travel');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('guest_checkins', function (Blueprint $table) {
            $table->dropColumn(['phone_number', 'purpose_of_travel', 'number_of_minors']);
        });
    }
};
