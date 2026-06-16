<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MessageTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'language',
        'subject',
        'content',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get a template by type and language.
     */
    public static function getTemplate(string $type, string $language): ?self
    {
        return self::where('type', $type)
            ->where('language', $language)
            ->where('is_active', true)
            ->first();
    }

    /**
     * Replace variables in the template content.
     */
    public function replaceVariables(array $data): array
    {
        $subject = $this->subject;
        $content = $this->content;

        foreach ($data as $key => $value) {
            $placeholder = '[' . strtoupper($key) . ']';
            $subject = str_replace($placeholder, $value, $subject);
            $content = str_replace($placeholder, $value, $content);
        }

        return [
            'subject' => $subject,
            'content' => $content,
        ];
    }
}
