<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->string('product_name');
            $table->string('description');
            $table->double('price');
            // $table->foreignId('quantity_id')->constrained('quantities')->onDelete('cascade');
            $table->integer('Totalquantity')->nullable();
            // $table->boolean('is_multipule')->default(false);
            $table->boolean('is_discounted')->default(false);
            $table->boolean('is_drafted')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
};
