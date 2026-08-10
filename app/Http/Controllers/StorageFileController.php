<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * Serves uploaded files (guidebook banners, item images, guest IDs, ...) directly
 * from storage/app/public.
 *
 * On hosts where `public/storage` is not a working symlink this is the only thing
 * keeping /storage/* URLs alive: git and zip deploys check that path out as a plain
 * directory, and `php artisan storage:link` then refuses to replace it. Where the
 * symlink is healthy the web server answers first and this controller never runs.
 */
class StorageFileController extends Controller
{
    public function __invoke(Request $request, string $path): BinaryFileResponse
    {
        abort_if(str_contains($path, '..'), 404);

        $disk = Storage::disk('public');

        abort_unless($disk->exists($path), 404);

        return response()->file($disk->path($path), [
            'Cache-Control' => 'public, max-age=31536000',
        ]);
    }
}
