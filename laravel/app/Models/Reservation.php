<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\Client;
use App\Models\PromoCode;
use App\Models\ReservationItem;

class Reservation extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $primaryKey = 'reservation_id';

    protected $fillable = [
        'token',
        'total_price',
        'status',
        'client_id',
        'used_promo_code',
        'generated_promo_code',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function reservationItems()
    {
        return $this->hasMany(ReservationItem::class, 'reservation_id');
    }

    public function usedPromoCode()
    {
        return $this->belongsTo(PromoCode::class, 'used_promo_code', 'code');
    }

    public function generatedCode()
    {
        return $this->belongsTo(PromoCode::class, 'generated_promo_code', 'code');
    }

}
