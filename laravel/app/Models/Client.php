<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\Reservation; 

class Client extends Model
{
    use HasFactory;

    protected $primaryKey = 'client_id';

     public $timestamps = false;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'total_debt'
    ];

    public function getTotalDebtAttribute()
    {
        return $this->reservations()
            ->where('status', 'aktivna')
            ->sum('total_price');
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'client_id');
    }
}
