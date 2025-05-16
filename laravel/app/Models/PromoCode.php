<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\Reservation; 

class PromoCode extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $primaryKey = 'code';
    
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'code',
        'discount_percent',
        'is_used',
    ];

    public function usedInReservation()
    {
        return $this->hasOne(Reservation::class, 'used_promo_code', 'code');
    }

    public function generatedByReservation()
    {
        return $this->hasOne(Reservation::class, 'generated_promo_code', 'code');
    }
}
