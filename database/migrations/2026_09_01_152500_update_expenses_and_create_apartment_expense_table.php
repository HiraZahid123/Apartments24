<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Modify expenses table: make apartment_id nullable, add apartment_group_id and user_id
        Schema::table('expenses', function (Blueprint $table) {
            $table->foreignId('apartment_id')->nullable()->change();
            $table->foreignId('apartment_group_id')->nullable()->after('apartment_id')->constrained('apartment_groups')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->after('id')->constrained('users')->cascadeOnDelete();
        });

        // 2. Create apartment_expense pivot table
        Schema::create('apartment_expense', function (Blueprint $table) {
            $table->id();
            $table->foreignId('expense_id')->constrained('expenses')->cascadeOnDelete();
            $table->foreignId('apartment_id')->constrained('apartments')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['expense_id', 'apartment_id']);
        });

        // 3. Backfill existing expenses into apartment_expense pivot table and set user_id from apartment owner
        $existingExpenses = DB::table('expenses')->whereNotNull('apartment_id')->get();
        foreach ($existingExpenses as $expense) {
            DB::table('apartment_expense')->insertOrIgnore([
                'expense_id' => $expense->id,
                'apartment_id' => $expense->apartment_id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $apartment = DB::table('apartments')->where('id', $expense->apartment_id)->first();
            if ($apartment && $apartment->owner_id) {
                DB::table('expenses')->where('id', $expense->id)->update([
                    'user_id' => $apartment->owner_id,
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('apartment_expense');

        Schema::table('expenses', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');

            $table->dropForeign(['apartment_group_id']);
            $table->dropColumn('apartment_group_id');

            $table->foreignId('apartment_id')->nullable(false)->change();
        });
    }
};
