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
            if (!Schema::hasColumn('apartments', 'rental_terms_et')) {
                $table->text('rental_terms_et')->nullable()->after('rental_terms');
            }
            if (!Schema::hasColumn('apartments', 'rental_terms_ru')) {
                $table->text('rental_terms_ru')->nullable()->after('rental_terms_et');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('apartments', function (Blueprint $table) {
            $table->dropColumn(['rental_terms_et', 'rental_terms_ru']);
        });
    }
};
