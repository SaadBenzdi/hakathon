<?php

namespace App\Models;

use Attribute;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = ['title', 'body', 'photo'];
    protected function photoUrl(): Attribute
    {
        return Attribute::get(fn () => $this->photo ? asset('storage/posts/' . $this->photo) : null);
    }
}

