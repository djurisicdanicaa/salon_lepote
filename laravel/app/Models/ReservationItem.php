<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\Reservation;
use App\Models\Service;

class ReservationItem extends Model
{
    use HasFactory;

     public $timestamps = false;

    protected $fillable = [
        'item_id',
        'reservation_id',
        'service_id',
        'scheduled_at', 
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class, 'reservation_id');
    }

    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id');
    }
}
