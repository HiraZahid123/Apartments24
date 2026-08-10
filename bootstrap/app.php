<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            // Fallback for /storage/* when public/storage is not a working symlink.
            // Registered outside the "web" group on purpose: serving an image must
            // not start a session or build Inertia's shared props, both of which
            // would add database queries to every single image request.
            Route::get('/storage/{path}', \App\Http\Controllers\StorageFileController::class)
                ->where('path', '.*')
                ->name('storage.serve');
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

         $middleware->alias([
        'admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
        'owner' => \App\Http\Middleware\EnsureUserIsOwner::class,
    ]);
     // Exclude the webhook route from CSRF verification
    $middleware->validateCsrfTokens(except: [
        'stripe/webhook',
    ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
