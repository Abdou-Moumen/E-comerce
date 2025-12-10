<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    public function CartAdd(Request $request)
    {


        $createcart = new Cart();
        $createcart->client_id = $request->client_id;
        $createcart->product_id = $request->product_id;
        $createcart->quantity = $request->quantity;
        $createcart->save();

        return response()->json(['message' => 'Product added to cart successfully.', 'cart' => $createcart], 201);
    }

    public function CartRemove(Request $request, $id)
    {
        $cart = Cart::where('product_id', $id)
            ->first();

        if ($cart) {
            $cart->delete();
            return response()->json(['message' => 'Product removed from cart successfully.'], 200);
        } else {
            return response()->json(['error' => 'Product not found in cart.'], 404);
        }
    }


    public function CartUpdate(Request $request)
    {
        $cart = Cart::where('product_id', $request->product_id)
            ->first();

        if ($cart) {
            $cart->quantity = $request->quantity;
            $cart->save();

            return response()->json(['message' => 'Cart updated successfully.', 'cart' => $cart], 200);
        } else {
            return response()->json(['error' => 'Product not found in cart.'], 404);
        }
    }

    public function viewCart($clientId)
{
    $cartItems = Cart::where('product_id', $clientId)->get();

    return response()->json($cartItems, 200);
}

    public function Carts($clientId)
{
    $cartItems = Cart::all();

    return response()->json($cartItems, 200);
}


}
