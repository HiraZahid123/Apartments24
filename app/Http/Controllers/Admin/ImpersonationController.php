<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ImpersonationController extends Controller
{
    public function take(User $user)
    {
        // Only admins can trigger this
        if (Auth::user()->user_type !== 'admin') {
            return redirect()->back()->with('error', 'Unauthorized');
        }

        // Logout admin and redirect to login with pre-filled guest email
        Auth::logout();
        
        return redirect()->route('login', ['email' => $user->email])
            ->with('info', 'Please enter ' . $user->name . '\'s password to switch.');
    }

    public function leave()
    {
        $adminId = session('impersonated_by');

        if (!$adminId) {
            return redirect()->route('dashboard');
        }

        $admin = User::find($adminId);
        
        if (!$admin || $admin->user_type !== 'admin') {
            session()->forget('impersonated_by');
            return redirect()->route('login');
        }

        Auth::login($admin);
        session()->forget('impersonated_by');

        return redirect()->route('admin.dashboard')->with('success', 'Returned to Admin Dashboard');
    }
}
