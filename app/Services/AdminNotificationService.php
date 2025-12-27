<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\Admin\AdminActivityNotification;

class AdminNotificationService
{
    public static function notifyAdmins(array $payload): void
    {
        User::query()
            ->whereRaw('UPPER(role) = ?', ['ADMIN'])
            ->each(function (User $admin) use ($payload) {
                $admin->notify(new AdminActivityNotification($payload));
            });
    }
}
