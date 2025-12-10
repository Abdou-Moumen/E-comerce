<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $name = $this->faker->company();
        $is_discounted = $this->faker->boolean();
        $category = Category::inRandomOrder()->first();

        return [
            'category_id' => $category->id,
            'product_name' => $name,
            'description' => $this->faker->text(),
            'price' => $this->faker->randomFloat(2, 1, 100), // Generate random price between 1 and 100 with 2 decimal places
            'quantity' => $this->faker->numberBetween(1, 100), // Generate random quantity between 1 and 100
            'is_discounted' => $is_discounted,
        ];
    }

}
