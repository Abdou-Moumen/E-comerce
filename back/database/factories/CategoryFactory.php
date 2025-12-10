<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
{
    $name = $this->faker->company();
    $type = $this->faker->randomElement(['cosmetic', 'vetement']);

    return [
        'name' => $name,
        'CategoryName' => $type,
    ];
}

}
