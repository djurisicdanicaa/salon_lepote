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
        Schema::create('reservations', function (Blueprint $table) {
            $table->id('reservation_id');
            $table->string('token', 6) -> unique();
            $table->double('total_price', 8, 2);
            $table->enum('status', ['aktivna', 'otkazano'])->default('aktivna');

            $table->unsignedBigInteger('client_id');
            $table->foreign('client_id')->references('client_id')->on('clients')->onDelete('cascade');

            $table->string('used_promo_code')->nullable(); 
            $table->foreign('used_promo_code')->references('code')->on('promo_codes')->nullOnDelete();

            $table->string('generated_promo_code')->nullable(); 
            $table->foreign('generated_promo_code')->references('code')->on('promo_codes')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('reservations');
    }
};
