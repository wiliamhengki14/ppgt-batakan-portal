<?php

namespace App\Http\Controllers;

use App\Models\PpgtProfile;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    //
    public function index(): Response
    {
        $user = Auth::user();
        $count_user = User::where('role', 'ppgt_member')->count();
        $newMember = User::where('role', 'ppgt_member')->where('created_at', '>=', now()->subDays(7))->count();

        // $user->load('profile');
        return Inertia::render('Dashboard', ['user' => $user, 'profile' => $user?->profile,
            'count_user' => $count_user,
            'stats' => [
                'lokal_ppgt' => PpgtProfile::where('residence_type', 'lokal_batakan')->count(),
                'perantau_ppgt' => PpgtProfile::where('residence_type', 'perantau')->count(),
                'new_member' => $newMember,
            ]]);
    }

    public function detail(): Response
    {
        return Inertia::render('Welcome');
    }
}
