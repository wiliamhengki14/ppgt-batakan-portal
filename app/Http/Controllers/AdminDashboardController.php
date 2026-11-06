<?php

namespace App\Http\Controllers;

use App\Models\PpgtProfile;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    //
    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'count_user' => User::where('role', 'ppgt_member')->count(),
                'count_pending' => PpgtProfile::with('user')->where('verification_status', 'pending')->count(),
                'count_approved' => PpgtProfile::with('user')->where('verification_status', 'approved')->count(),
                'is_eligible' => User::where('is_eligible_for_duty', true)->count(),
                'lokal' => PpgtProfile::where('residence_type', 'lokal_batakan')->count(),
                'perantau' => PpgtProfile::where('residence_type', 'perantau')->count(),
                'pending_verification' => PpgtProfile::with('user')
                    ->where('verification_status', 'pending')
                    ->latest()
                    ->take(5)
                    ->get(),
            ],
        ]);
    }
}
