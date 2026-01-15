<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class StaticPageController extends Controller
{
    public function about()
    {
        return Inertia::render('Static/About');
    }

    public function privacy()
    {
        return Inertia::render('Static/Privacy');
    }

    public function terms()
    {
        return Inertia::render('Static/Terms');
    }

    public function security()
    {
        return Inertia::render('Static/Security');
    }

    public function features()
    {
        return Inertia::render('Static/Features');
    }
}
