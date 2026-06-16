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
            $table->boolean('wants_invoice')->default(false)->after('checked_out_at');
            $table->string('invoice_name')->nullable()->after('wants_invoice');
            $table->string('invoice_registration_code')->nullable()->after('invoice_name');
            $table->text('invoice_address')->nullable()->after('invoice_registration_code');
            $table->string('invoice_vat_number')->nullable()->after('invoice_address');
            $table->text('invoice_accommodated_guests')->nullable()->after('invoice_vat_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn([
                'wants_invoice',
                'invoice_name',
                'invoice_registration_code',
                'invoice_address',
                'invoice_vat_number',
                'invoice_accommodated_guests'
            ]);
        });
    }
};
