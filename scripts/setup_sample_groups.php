<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Apartment;
use App\Models\ApartmentGroup;
use App\Models\Expense;
use Illuminate\Support\Str;

$owner = User::where('user_type', 'owner')->first();
if (!$owner) {
    echo "No owner user found!\n";
    exit(1);
}
echo "Configuring for Owner: {$owner->name} (ID: {$owner->id})\n";

// 1. Create or get Apartments24 Spordi Group
$spordiGroup = ApartmentGroup::firstOrCreate(['name' => 'Apartments24 Spordi']);
echo "Group: {$spordiGroup->name} (ID: {$spordiGroup->id})\n";

$spordiUnits = ['Spordi 201', 'Spordi 202', 'Spordi 203', 'Spordi 204', 'Spordi 205'];
$spordiAptIds = [];
foreach ($spordiUnits as $name) {
    $apt = Apartment::firstOrCreate(
        ['name' => $name],
        [
            'address' => 'Spordi 20, Tallinn',
            'city' => 'Tallinn',
            'owner_id' => $owner->id,
            'owner_name' => $owner->name,
            'apartment_group_id' => $spordiGroup->id,
            'is_active' => true,
            'arrival_url' => Str::slug($name) . '-' . Str::random(6),
        ]
    );
    $apt->update([
        'owner_id' => $owner->id,
        'apartment_group_id' => $spordiGroup->id,
        'is_active' => true,
    ]);
    $spordiAptIds[] = $apt->id;
}
echo "Configured Spordi apartments: " . implode(', ', $spordiUnits) . "\n";

// 2. Create or get Apartments24 Ilu Group
$iluGroup = ApartmentGroup::firstOrCreate(['name' => 'Apartments24 Ilu']);
echo "Group: {$iluGroup->name} (ID: {$iluGroup->id})\n";

$iluUnits = ['Ilu Economy', 'Ilu Comfort'];
$iluAptIds = [];
foreach ($iluUnits as $name) {
    $apt = Apartment::firstOrCreate(
        ['name' => $name],
        [
            'address' => 'Ilu 15, Tallinn',
            'city' => 'Tallinn',
            'owner_id' => $owner->id,
            'owner_name' => $owner->name,
            'apartment_group_id' => $iluGroup->id,
            'is_active' => true,
            'arrival_url' => Str::slug($name) . '-' . Str::random(6),
        ]
    );
    $apt->update([
        'owner_id' => $owner->id,
        'apartment_group_id' => $iluGroup->id,
        'is_active' => true,
    ]);
    $iluAptIds[] = $apt->id;
}
echo "Configured Ilu apartments: " . implode(', ', $iluUnits) . "\n";

// 3. Black 1903 (Unassigned to group)
$blackApt = Apartment::firstOrCreate(
    ['name' => 'Black 1903'],
    [
        'address' => 'Black street 19-3, Tallinn',
        'city' => 'Tallinn',
        'owner_id' => $owner->id,
        'owner_name' => $owner->name,
        'apartment_group_id' => null,
        'is_active' => true,
        'arrival_url' => 'black-1903-' . Str::random(6),
    ]
);
$blackApt->update([
    'owner_id' => $owner->id,
    'apartment_group_id' => null,
    'is_active' => true,
]);
echo "Configured Black 1903 (ID: {$blackApt->id})\n";

// 4. Clean up any previous test duplicates for Spordi units and create a single group row of €60.00
Expense::where(function ($query) use ($spordiAptIds, $spordiGroup) {
    $query->whereIn('apartment_id', $spordiAptIds)
          ->orWhere('apartment_group_id', $spordiGroup->id);
})->where('description', 'TEST')->delete();

$groupExpense = Expense::create([
    'user_id' => $owner->id,
    'apartment_id' => null,
    'apartment_group_id' => $spordiGroup->id,
    'description' => 'TEST',
    'amount' => 60.00,
    'date' => '2026-08-31',
]);
$groupExpense->apartments()->sync($spordiAptIds);
echo "Created single unified group expense for Apartments24 Spordi: €60.00 (ID: {$groupExpense->id})\n";

// 5. Create or verify Black 1903 expense: €128.00 Kommunaal on 2026-08-14
$blackExpense = Expense::firstOrCreate(
    [
        'apartment_id' => $blackApt->id,
        'description' => 'Kommunaal',
        'date' => '2026-08-14',
    ],
    [
        'user_id' => $owner->id,
        'amount' => 128.00,
    ]
);
$blackExpense->apartments()->sync([$blackApt->id]);
echo "Configured Black 1903 expense: €128.00 (ID: {$blackExpense->id})\n";

echo "SUCCESS: Sample groups, apartments, and single-row group expenses configured successfully!\n";
