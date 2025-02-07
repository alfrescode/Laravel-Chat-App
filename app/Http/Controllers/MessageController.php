<?php
namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function index()
    {
        return Inertia::render('Inbox', [
            'auth' => ['user' => Auth::user()],
            'users' => User::all(),
            'messages' => [],
        ]);
    }

    public function inbox() {
        $users = User::where('id', '!=', Auth::id())->get();
        return Inertia::render('Inbox', [
            'users' => $users,
            'auth' => Auth::user()
        ]);
    }

    public function sendMessage(Request $request, User $user)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $message = Message::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $user->id,
            'message' => $request->message,
        ]);

        broadcast(new MessageSent($message))->toOthers();

        return response()->json($message, 201);
    }

    public function getMessages(User $user) {
        $user1Id = Auth::id();
        $user2Id = $user->id;

        $messages = Message::where(function($query) use ($user1Id, $user2Id) {
            $query->where('sender_id', $user1Id)->where('receiver_id', $user2Id);
        })->orWhere(function($query) use ($user1Id, $user2Id) {
            $query->where('sender_id', $user2Id)->where('receiver_id', $user1Id);
        })
        ->orderBy('created_at', 'asc')
        ->get();
        
        return response()->json($messages);
    }
}