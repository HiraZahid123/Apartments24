<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ------------------- PUBLIC ROUTES -------------------
Route::get('/', fn() => inertia('Welcome'))->name('home');
Route::get('/about', [App\Http\Controllers\StaticPageController::class, 'about'])->name('about');
Route::get('/privacy', [App\Http\Controllers\StaticPageController::class, 'privacy'])->name('privacy');
Route::get('/terms', [App\Http\Controllers\StaticPageController::class, 'terms'])->name('terms');
Route::get('/security', [App\Http\Controllers\StaticPageController::class, 'security'])->name('security');

// ------------------- DASHBOARD (Redirects based on user type) -------------------
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        $user = auth()->user();
        if ($user->user_type === 'admin') return redirect()->route('admin.dashboard');
        if ($user->user_type === 'owner') return redirect()->route('owner.dashboard');
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/admin/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('admin.dashboard')->middleware('admin');
});

// ------------------- PROFILE -------------------
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ------------------- ADMIN ROUTES (Phase 3) -------------------
Route::prefix('admin')->middleware(['auth', 'admin'])->name('admin.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    Route::resource('apartments', App\Http\Controllers\Admin\ApartmentController::class);
    Route::delete('/bookings/bulk-destroy', [App\Http\Controllers\Admin\BookingController::class, 'bulkDestroy'])->name('bookings.bulk-destroy');
    Route::post('/bookings/bulk-update-status', [App\Http\Controllers\Admin\BookingController::class, 'bulkUpdateStatus'])->name('bookings.bulk-update-status');
    Route::resource('bookings', App\Http\Controllers\Admin\BookingController::class);
    Route::post('bookings/{booking}/send-checkin', [App\Http\Controllers\Admin\BookingController::class, 'sendCheckin'])->name('bookings.send-checkin');

    Route::get('visitor-cards', [App\Http\Controllers\Admin\VisitorCardController::class, 'index'])->name('visitor-cards.index');
    Route::get('visitor-cards/generate', [App\Http\Controllers\Admin\VisitorCardController::class, 'generate'])->name('visitor-cards.generate');
    Route::resource('users', App\Http\Controllers\Admin\UserController::class);
    
    // Global Search API
    Route::get('/search', [App\Http\Controllers\Api\SearchController::class, 'search'])->name('search');

    // Notifications
    Route::get('/notifications', [App\Http\Controllers\Admin\NotificationController::class, 'index'])->name('notifications.index');
    Route::get('/notifications/latest', [App\Http\Controllers\Admin\NotificationController::class, 'getLatest'])->name('notifications.latest');
    Route::post('/notifications/{id}/read', [App\Http\Controllers\Admin\NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [App\Http\Controllers\Admin\NotificationController::class, 'markAllRead'])->name('notifications.read-all');

    // Reports
    Route::get('/reports', [\App\Http\Controllers\Admin\ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/export', [\App\Http\Controllers\Admin\ReportController::class, 'export'])->name('reports.export');
});

// ------------------- OWNER ROUTES (Phase 6) -------------------
Route::prefix('owner')->middleware(['auth', 'owner'])->name('owner.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Owner\DashboardController::class, 'index'])->name('dashboard');
    Route::resource('expenses', App\Http\Controllers\Owner\ExpenseController::class)->only(['index', 'create', 'store', 'destroy']);
});

// ------------------- GUEST ROUTES (Phase 4) -------------------
Route::prefix('guest')->name('guest.')->group(function () {
    Route::get('/checkin/{token}', [App\Http\Controllers\Guest\CheckinController::class, 'show'])->name('checkin');
    Route::post('/checkin/{token}', [App\Http\Controllers\Guest\CheckinController::class, 'store'])->name('checkin.store');
    Route::get('/checkin/{token}/success', [App\Http\Controllers\Guest\CheckinController::class, 'success'])->name('checkin.success');
    Route::post('/checkin/{token}/checkout', [App\Http\Controllers\Guest\CheckinController::class, 'checkout'])->name('checkin.checkout');
});

require __DIR__ . '/auth.php';
