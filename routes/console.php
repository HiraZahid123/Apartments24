<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

// Send checkout reminder emails daily at 07:00 EET (Europe/Tallinn timezone)
Schedule::command('send:checkout-reminders')
    ->dailyAt('07:00')
    ->timezone('Europe/Tallinn')
    ->description('Send checkout reminder emails to guests');
