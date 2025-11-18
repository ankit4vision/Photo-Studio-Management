<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'key',
        'value',
        'group',
        'description',
    ];

    /**
     * Get setting by key and group.
     *
     * @param string $key
     * @param string $group
     * @param mixed $default
     * @return mixed
     */
    public static function get($key, $group = null, $default = null)
    {
        $query = static::where('key', $key);
        
        if ($group) {
            $query->where('group', $group);
        }
        
        $setting = $query->first();
        
        return $setting ? $setting->value : $default;
    }

    /**
     * Set setting value.
     *
     * @param string $key
     * @param mixed $value
     * @param string $group
     * @param string|null $description
     * @return static
     */
    public static function set($key, $value, $group = 'general', $description = null)
    {
        return static::updateOrCreate(
            ['key' => $key, 'group' => $group],
            ['value' => $value, 'description' => $description]
        );
    }

    /**
     * Get all settings by group.
     *
     * @param string $group
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getByGroup($group)
    {
        return static::where('group', $group)->get();
    }

    /**
     * Get standardized business information settings.
     *
     * @param array $additionalKeys
     * @return array<string, mixed>
     */
    public static function businessInfo(array $additionalKeys = []): array
    {
        $defaultKeys = [
            'business_name',
            'business_address',
            'business_phone',
            'business_email',
            'business_website',
            'business_logo',
            'gstNumber',
            'tax_number',
        ];

        $keys = array_unique(array_merge($defaultKeys, $additionalKeys));

        return static::whereIn('key', $keys)
            ->pluck('value', 'key')
            ->toArray();
    }

    /**
     * Get settings as key-value array.
     *
     * @param string $group
     * @return array
     */
    public static function getAsArray($group)
    {
        return static::where('group', $group)
            ->pluck('value', 'key')
            ->toArray();
    }

    /**
     * Get logo resource for logo settings.
     *
     * @return Resource|null
     */
    public function logoResource()
    {
        if (in_array($this->key, ['business_logo', 'logo'])) {
            return Resource::where('related_table', 'settings')
                ->where('related_id', $this->id)
                ->where('module', 'settings')
                ->where('folder', 'logos')
                ->where('is_primary', true)
                ->where('status', 'active')
                ->first();
        }
        return null;
    }

    /**
     * Get logo image object for API responses.
     * ONLY from Resource table - no fallback to value field.
     *
     * @return array|null
     */
    public function getLogoImageAttribute()
    {
        $resource = $this->logoResource();
        
        if (!$resource) {
            return null;
        }

        return $resource->toImageObject();
    }
}

