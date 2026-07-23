<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Booking;
use App\Mail\CheckoutReminderMail;
use App\Models\AutomatedMessageLog;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class SendCheckoutReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send:checkout-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send checkout reminder emails to guests checking out today';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Searching for bookings with checkout today...');
        
        // Get all bookings checking out today that haven't been sent a reminder
        $today = Carbon::today('Europe/Tallinn');
        
        $bookings = Booking::with('apartment')
            ->where('check_out_date', $today)
            ->where('status', 'checked_in')
            ->get();

        if ($bookings->isEmpty()) {
            $this->info('No bookings found checking out today.');
            return 0;
        }

        $this->info("Found {$bookings->count()} bookings checking out today.");
        $sent = 0;
        $failed = 0;

        foreach ($bookings as $booking) {
            // Check if checkout reminder is disabled for this booking
            $disabled = $booking->disabled_automated_messages ?? [];
            if (in_array('checkout_reminder', $disabled)) {
                $this->info("Skipping checkout reminder for booking #{$booking->id} ({$booking->guest_name}) as it is disabled.");
                continue;
            }

            // Check if reminder already sent today
            $alreadySent = AutomatedMessageLog::where('booking_id', $booking->id)
                ->where('message_type', 'checkout_reminder')
                ->whereDate('sent_at', $today)
                ->exists();

            if ($alreadySent) {
                $this->warn("Reminder already sent for booking #{$booking->id} ({$booking->guest_name})");
                continue;
            }

            try {
                $language = $booking->preferred_language ?? 'en';
                
                // Send checkout reminder email
                Mail::to($booking->guest_email)->send(new CheckoutReminderMail($booking, $language));

                // Log the message
                AutomatedMessageLog::logMessage(
                    $booking->id,
                    'checkout_reminder',
                    $language,
                    $booking->guest_email,
                    true
                );

                $this->info("✓ Sent reminder to {$booking->guest_name} ({$booking->guest_email})");
                $sent++;
            } catch (\Exception $e) {
                $this->error("✗ Failed to send reminder to {$booking->guest_name}: " . $e->getMessage());
                
                AutomatedMessageLog::logMessage(
                    $booking->id,
                    'checkout_reminder',
                    $booking->preferred_language ?? 'en',
                    $booking->guest_email,
                    false,
                    $e->getMessage()
                );
                
                $failed++;
            }
        }

        $this->info("\nSummary: {$sent} sent, {$failed} failed");
        return 0;
    }
}
