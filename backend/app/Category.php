<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'imagen',
        'name',
        'slug',
        'description',
    ];

    public function posts(Request $request)
    {
        return $this->hasMany('App\Post');
    }
}
