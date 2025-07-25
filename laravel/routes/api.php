<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ReservationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();

});

Route::get('/services', [ServiceController::class, 'loadServices']);
Route::post('/reservations', [ReservationController::class, 'store']);
Route::post('/reservations/details', [ReservationController::class, 'show']);
Route::post('/reservations/cancel', [ReservationController::class, 'cancel']);


