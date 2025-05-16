<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

     public $timestamps = false;

     protected $primaryKey = 'service_id';

    protected $fillable = [
        'name',
        'capacity',
        'description',
        'price',
        'image'
    ];

    public function reservationItems()
    {
        return $this->hasMany(ReservationItem::class, 'service_id');
    }
}
