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
}

