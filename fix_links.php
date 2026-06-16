<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Apartment;

$apartments = Apartment::all();
$output = "";
foreach ($apartments as $a) {
    $output .= "ID: {$a->id}, Name: {$a->name}\n";
    $output .= "Arrival URL (Slug/Token): {$a->arrival_url}\n";
    $output .= "Arrival URL EN: " . ($a->arrival_url_en ?? 'NULL') . "\n";
    
    // If EN is empty but the main arrival_url looks like a real URL, fix it
    if (empty($a->arrival_url_en) && (strpos($a->arrival_url, 'http') === 0)) {
        $output .= "Fixing ID {$a->id}: Moving URL to EN field...\n";
        $a->arrival_url_en = $a->arrival_url;
        // Also need to generate a proper slug if we are using it as a link
        $a->arrival_url = \Illuminate\Support\Str::slug($a->name) . '-' . \Illuminate\Support\Str::random(8);
        $a->save();
        $output .= "Fixed. New Slug: {$a->arrival_url}\n";
    }
    $output .= "-------------------\n";
}
file_put_contents('db_check.txt', $output);
