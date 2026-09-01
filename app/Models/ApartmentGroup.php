<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApartmentGroup extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function apartments()
    {
        return $this->hasMany(Apartment::class);
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }
}
