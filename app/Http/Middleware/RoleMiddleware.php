<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, $role): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();

        // Check role
        if ($user->role !== $role) {
            abort(403, 'Unauthorized.');
        }

        // Extra check for club_admin: must be approved
        if ($role === 'club_admin' && $user->club && $user->club->status !== 'approved') {
            Auth::logout();
            return redirect()->route('login')->with('error', 'Your club account is not approved yet.');
        }

        return $next($request);
    }
}
