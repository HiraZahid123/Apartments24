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
            $table->string('owner_name')->nullable()->after('owner_id');
            $table->string('keybox_code')->nullable()->after('owner_name');
            $table->text('rental_terms')->nullable()->after('instructions');
            $table->boolean('is_active')->default(true)->after('rental_terms');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('apartments', function (Blueprint $table) {
            $table->dropColumn(['owner_name', 'keybox_code', 'rental_terms', 'is_active']);
        });
    }
};
