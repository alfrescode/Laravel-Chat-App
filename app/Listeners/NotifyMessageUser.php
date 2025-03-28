<?php

namespace App\Listeners;

use App\Events\MessageSent;
use App\Notifications\NewMessageNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class NotifyMessageUser implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(MessageSent $event): void
    {
        $recipient = $event->message->recipient;
        $recipient->notify(new NewMessageNotification($event->message));
    }
}