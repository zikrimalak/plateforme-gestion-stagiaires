<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // GET /mes-notifications — historique du stagiaire connecté, plus récentes en premier
    public function mesNotifications(Request $request)
    {
        $notifications = Notification::where('user_id', $request->user()->id)
            ->orderBy('date_envoi', 'desc')
            ->get();

        return response()->json($notifications);
    }
}