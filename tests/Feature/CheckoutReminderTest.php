<?php

namespace Tests\Feature;

use App\Models\Apartment;
use App\Models\AutomatedMessageLog;
use App\Models\Booking;
use App\Models\User;
use App\Mail\CheckoutReminderMail;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class CheckoutReminderTest extends TestCase
{
    use RefreshDatabase;

    private function createOwnerWithApartment(string $emailSuffix, string $arrivalUrl): array
    {
        $owner = User::create([
            'name' => 'Owner',
            'email' => "owner_{$emailSuffix}@example.com",
            'password' => bcrypt('password'),
            'user_type' => 'owner',
        ]);

        $apartment = Apartment::create([
            'name' => "Apartment {$emailSuffix}",
            'address' => "Address {$emailSuffix}",
            'city' => 'Tallinn',
            'arrival_url' => $arrivalUrl,
            'owner_id' => $owner->id,
            'is_active' => true,
        ]);

        return [$owner, $apartment];
    }

    /**
     * Test 1: Basic behavior — disabled booking is skipped, active booking is sent.
     */
    public function test_checkout_reminder_sends_only_to_non_disabled_bookings_sharing_same_date(): void
    {
        Mail::fake();

        $today = Carbon::today('Europe/Tallinn');
        Carbon::setTestNow($today);

        [, $apartmentA] = $this->createOwnerWithApartment('A', 'https://example.com/arrival-a');
        [, $apartmentB] = $this->createOwnerWithApartment('B', 'https://example.com/arrival-b');

        // Booking A: checkout_reminder disabled
        $bookingA = Booking::create([
            'apartment_id' => $apartmentA->id,
            'guest_name' => 'Guest A',
            'guest_email' => 'guest_a@example.com',
            'check_in_date' => $today->copy()->subDays(3),
            'check_out_date' => $today,
            'number_of_guests' => 2,
            'preferred_language' => 'en',
            'total_price' => 150.00,
            'service_fee' => 15.00,
            'status' => 'confirmed',
            'disabled_automated_messages' => ['checkout_reminder'],
        ]);

        // Booking B: checkout_reminder enabled
        $bookingB = Booking::create([
            'apartment_id' => $apartmentB->id,
            'guest_name' => 'Guest B',
            'guest_email' => 'guest_b@example.com',
            'check_in_date' => $today->copy()->subDays(3),
            'check_out_date' => $today,
            'number_of_guests' => 2,
            'preferred_language' => 'en',
            'total_price' => 180.00,
            'service_fee' => 18.00,
            'status' => 'confirmed',
            'disabled_automated_messages' => [],
        ]);

        $this->artisan('send:checkout-reminders')->assertExitCode(0);

        // Booking A: must NOT have received the email
        Mail::assertNotSent(CheckoutReminderMail::class, function ($mail) use ($bookingA) {
            return $mail->booking->id === $bookingA->id;
        });

        // Booking B: MUST have received the email
        Mail::assertSent(CheckoutReminderMail::class, function ($mail) use ($bookingB) {
            return $mail->booking->id === $bookingB->id && $mail->hasTo($bookingB->guest_email);
        });
    }

    /**
     * Test 2 — Reproduces the core bug:
     *
     * Scenario that matches user's report:
     *   - Booking A has checkout_reminder disabled.
     *   - Booking B has checkout_reminder active, but a previous run already tried and
     *     FAILED to deliver (logged as 'failed').
     *
     * Without the fix the alreadySent check finds the 'failed' entry and skips Booking B,
     * so neither booking receives the reminder — exactly what the user observed.
     *
     * With the fix (alreadySent filters by status = 'sent') Booking B is retried.
     */
    public function test_checkout_reminder_retries_booking_whose_previous_attempt_failed(): void
    {
        Mail::fake();

        // Use noon Tallinn time so that now() (stored as UTC 09:00) and
        // $today->toDateString() both resolve to the same calendar date in SQLite/MySQL.
        // This makes the pre-seeded 'failed' log detectable by the alreadySent query.
        $today = Carbon::today('Europe/Tallinn');
        Carbon::setTestNow(Carbon::parse('12:00:00', 'Europe/Tallinn'));

        [, $apartmentA] = $this->createOwnerWithApartment('C', 'https://example.com/arrival-c');
        [, $apartmentB] = $this->createOwnerWithApartment('D', 'https://example.com/arrival-d');

        // Booking A: checkout_reminder disabled
        $bookingA = Booking::create([
            'apartment_id' => $apartmentA->id,
            'guest_name' => 'Guest C',
            'guest_email' => 'guest_c@example.com',
            'check_in_date' => $today->copy()->subDays(3),
            'check_out_date' => $today,
            'number_of_guests' => 2,
            'preferred_language' => 'en',
            'total_price' => 150.00,
            'service_fee' => 15.00,
            'status' => 'confirmed',
            'disabled_automated_messages' => ['checkout_reminder'],
        ]);

        // Booking B: checkout_reminder enabled
        $bookingB = Booking::create([
            'apartment_id' => $apartmentB->id,
            'guest_name' => 'Guest D',
            'guest_email' => 'guest_d@example.com',
            'check_in_date' => $today->copy()->subDays(3),
            'check_out_date' => $today,
            'number_of_guests' => 2,
            'preferred_language' => 'en',
            'total_price' => 180.00,
            'service_fee' => 18.00,
            'status' => 'confirmed',
            'disabled_automated_messages' => [],
        ]);

        // Simulate a prior FAILED delivery for Booking B (e.g. SMTP timeout on first run)
        AutomatedMessageLog::logMessage(
            $bookingB->id,
            'checkout_reminder',
            'en',
            $bookingB->guest_email,
            false,
            'SMTP connection timeout'
        );

        // Confirm the failed log was actually written
        $this->assertDatabaseHas('automated_message_logs', [
            'booking_id'   => $bookingB->id,
            'message_type' => 'checkout_reminder',
            'status'       => 'failed',
        ]);

        // Run the command — this is the re-run after the first failure
        $this->artisan('send:checkout-reminders')->assertExitCode(0);

        // Booking A: still explicitly disabled, must NOT receive the email
        Mail::assertNotSent(CheckoutReminderMail::class, function ($mail) use ($bookingA) {
            return $mail->booking->id === $bookingA->id;
        });

        // Booking B: had a failed log but checkout_reminder is ACTIVE
        // The command MUST retry and successfully send it
        Mail::assertSent(CheckoutReminderMail::class, function ($mail) use ($bookingB) {
            return $mail->booking->id === $bookingB->id && $mail->hasTo($bookingB->guest_email);
        });

        // Confirm a successful log entry was created for Booking B after the retry
        $this->assertDatabaseHas('automated_message_logs', [
            'booking_id'   => $bookingB->id,
            'message_type' => 'checkout_reminder',
            'status'       => 'sent',
        ]);
    }
}
