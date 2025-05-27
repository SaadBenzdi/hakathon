<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Modifier la colonne qr_code pour utiliser TEXT au lieu de VARCHAR
\Illuminate\Support\Facades\DB::statement('ALTER TABLE users MODIFY COLUMN qr_code TEXT');

echo "La colonne qr_code a été modifiée avec succès en type TEXT.\n";
