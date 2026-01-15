<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton('bracket', function ($app) {
        return new \App\Services\BracketService();
    });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
         Inertia::share([
        'flash' => function () {
            return [
                'success' => session('success'),
                'error'   => session('error'),
            ];
        },
         'auth' => fn() => [
            'user' => auth()->user(),
        ],
    ]);
        Schema::defaultStringLength(191);
        Vite::prefetch(concurrency: 3);
    }
}
