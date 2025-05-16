<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Models\Client;
use App\Models\Service;
use App\Models\Reservation;
use App\Models\ReservationItem;
use App\Models\PromoCode;

class ReservationController extends Controller
{
   public function store(Request $request)
{
    $request->validate([
        'first_name' => 'required|string',
        'last_name' => 'required|string',
        'email' => 'required|email',
        'services' => 'required|array|min:1',
        'services.*.service_id' => 'required|exists:services,service_id',
        'services.*.scheduled_at' => 'required|date_format:Y-m-d H:i:s', // ili Y-m-d H:i
        'promo_code' => 'nullable|string|exists:promo_codes,code',
    ]);

    return DB::transaction(function () use ($request) {
        $client = Client::firstOrCreate(
            ['email' => $request->email],
            ['first_name' => $request->first_name, 'last_name' => $request->last_name]
        );

        $usedPromo = null;
        if ($request->filled('promo_code')) {
            $usedPromo = PromoCode::where('code', $request->promo_code)
                ->where('is_used', false)
                ->first();

            if (!$usedPromo) {
                return response()->json(['error' => 'Promo kod je nevažeći ili već iskorišćen.'], 422);
            }
        }

        $totalPrice = 0;
        $itemsData = [];

        foreach ($request->services as $item) {
            $service = Service::findOrFail($item['service_id']);
            $scheduledAt = $item['scheduled_at'];

            $reservedCount = ReservationItem::where('service_id', $service->service_id)
                ->where('scheduled_at', $scheduledAt)
                ->count();

            if ($reservedCount >= $service->capacity) {
                return response()->json([
                    'error' => "Usluga '{$service->name}' nije dostupna u terminu {$scheduledAt}."
                ], 422);
            }

            $itemsData[] = ['service' => $service, 'scheduled_at' => $scheduledAt];
            $totalPrice += $service->price;
        }

        $discountAmount = 0;
        if ($usedPromo) {
            $discountAmount = ($usedPromo->discount_percent / 100) * $totalPrice;
        }
        $finalPrice = round($totalPrice - $discountAmount, 2);

        $reservation = Reservation::create([
            'client_id' => $client->client_id,
            'token' => Str::upper(Str::random(6)),
            'total_price' => $finalPrice,
            'status' => 'na čekanju',
            'used_promo_code' => $usedPromo ? $usedPromo->code : null,
            'generated_promo_code' => null,
        ]);

        $maxItemId = ReservationItem::max('item_id') ?? 0;

        foreach ($itemsData as $item) {
            $maxItemId++;

            ReservationItem::create([
                'item_id' => $maxItemId,
                'reservation_id' => $reservation->reservation_id,
                'service_id' => $item['service']->service_id,
                'scheduled_at' => $item['scheduled_at'],
            ]);
        }

        if ($usedPromo) {
            $usedPromo->update(['is_used' => true]);
        }

        $discountOptions = [5, 10, 15, 20];
        $newDiscount = $discountOptions[array_rand($discountOptions)];
        $newPromoCode = PromoCode::create([
            'code' => Str::upper(Str::random(6)),
            'discount_percent' => $newDiscount,
            'is_used' => false,
        ]);

        $reservation->update(['generated_promo_code' => $newPromoCode->code]);

       return response()->json([
        'message' => 'Uspešna rezervacija! Vaš token je: ' . $reservation->token,
        'reservation_token' => $reservation->token,
        'generated_promo_code' => $newPromoCode->code,
        'discountPercent' => $usedPromo ? $usedPromo->discount_percent : 0,
        'totalPrice' => $finalPrice,
    ], 201);

    });
}

}
