<?php

namespace App\Support;

use App\Models\Booking;
use Illuminate\Support\Collection;

class BookingFinancials
{
    /**
     * Break a single booking's gross price down into its components.
     *
     * total_price (VAT incl.) = vat_amount + service_fee + admin_management_fee + net_revenue
     */
    public static function breakdown(Booking $booking): array
    {
        $totalPrice = (float) $booking->total_price;
        $serviceFee = (float) ($booking->service_fee ?? 0);
        $netRevenue = (float) $booking->net_revenue;

        $priceAfterVat = $totalPrice / 1.13;
        $vatAmount = $totalPrice - $priceAfterVat;
        $netIncome = $priceAfterVat - $serviceFee;

        // Admin's management fee is whatever is left of the net income after the owner's payout.
        $adminManagementFee = $netIncome - $netRevenue;

        return [
            'total_price' => $totalPrice,
            'vat_amount' => $vatAmount,
            'service_fee' => $serviceFee,
            'admin_management_fee' => $adminManagementFee,
            'net_revenue' => $netRevenue,
        ];
    }

    /**
     * Sum the breakdown across a collection of bookings.
     */
    public static function sumForCollection(Collection $bookings): array
    {
        $totals = [
            'total_revenue' => 0.0,
            'vat_amount' => 0.0,
            'service_fees' => 0.0,
            'admin_commission' => 0.0,
            'net_revenue' => 0.0,
        ];

        foreach ($bookings as $booking) {
            $b = self::breakdown($booking);
            $totals['total_revenue'] += $b['total_price'];
            $totals['vat_amount'] += $b['vat_amount'];
            $totals['service_fees'] += $b['service_fee'];
            $totals['admin_commission'] += $b['admin_management_fee'];
            $totals['net_revenue'] += $b['net_revenue'];
        }

        return $totals;
    }
}
