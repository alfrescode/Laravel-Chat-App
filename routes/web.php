<?php

use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/inbox', [MessageController::class, 'index'])->name('inbox');
    Route::post('/inbox/{user}', [MessageController::class, 'sendMessage']);
    Route::get('/inbox/{user}', [MessageController::class, 'getMessages']);

    Route::get('/notifications/unread', function () {
        return auth()->user()->unreadNotifications;
    })->name('notifications.unread');
    
    Route::post('/notifications/mark-as-read/{id}', function ($id) {
        auth()->user()->notifications()->findOrFail($id)->markAsRead();
        return response()->noContent();
    })->name('notifications.markAsRead');
});

require __DIR__.'/auth.php';