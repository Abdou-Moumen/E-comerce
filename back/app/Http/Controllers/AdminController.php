<?php

namespace App\Http\Controllers;

use App\Models\LogOders;
use App\Models\Quantity;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use App\Models\Address;
use App\Models\Category;
use App\Models\Client;
use App\Models\Discount;
use App\Models\EmployeeCycle;
use App\Models\LogLogins;
use App\Models\Orders;
use App\Models\Product;
use App\Models\ProductColor;
use App\Models\ProductImage;
use App\Models\ProductOrder;
use App\Models\SelledItems;
use App\Models\Size;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Support\Facades\Hash;
use PHPUnit\TextUI\XmlConfiguration\Logging\Logging;
use Illuminate\Support\Facades\Storage;
use ZipArchive;

class AdminController extends Controller
{

    public function CreateClientOrder(Request $request)
    {
        DB::beginTransaction();

        try {
            // Create Address
            $createAddress = new Address;
            $createAddress->wilaya = $request->wilaya;
            $createAddress->common = $request->common;
            $createAddress->adress = $request->adress;
            $createAddress->save();

            if (!$createAddress->id) {
                throw new Exception('Failed to create address');
            }

            $addressId = $createAddress->id;

            // Create Client
            $createClient = new Client;
            $createClient->first_name = $request->first_name;
            $createClient->last_name = $request->last_name;
            $createClient->phone_1 = $request->phone_1;
            $createClient->phone_2 = $request->phone_2;
            $createClient->addresse_id = $addressId;
            $createClient->save();

            if (!$createClient->id) {
                throw new Exception('Failed to create client');
            }

            $clientId = $createClient->id;

            // Create Order
            $createCommand = new Orders;
            $createCommand->client_id = $clientId;
            $createCommand->status = 'pending';
            // total_price is not set yet
            $createCommand->save();

            if (!$createCommand->id) {
                throw new Exception('Failed to create order');
            }

            // Retrieve the employee with the lowest cyclejob
            $employeeWithMinCycleJob = User::where('role', 'employee')
                ->where('isDeleted', 0)
                ->orderBy('count', 'asc')
                ->first();

            // Check if an employee with min cyclejob is found
            if (!$employeeWithMinCycleJob) {
                return response()->json(['message' => 'No employees found'], 404);
            }

            // Create a new EmployeeCycle entry
            $employeeCycle = new EmployeeCycle();
            $employeeCycle->user_id = $employeeWithMinCycleJob->id;
            $employeeCycle->order_id = $createCommand->id;
            $employeeCycle->save();

            // Update the employee's cyclejob count
            $employeeWithMinCycleJob->count++;
            $employeeWithMinCycleJob->save();

            $totalPriceForOrder = 0;

            // Iterate over each product order in the request
            foreach ($request->product_orders as $productOrder) {
                $product = Product::find($productOrder['product_id']);
                if (!$product) {
                    throw new Exception('Product not found');
                }

                $quantity = Quantity::where('product_id', $product->id)
                    ->where('size_id', $productOrder['size_id'])
                    ->where('product_color_id', $productOrder['product_color_id'])
                    ->first();

                if (!$quantity) {
                    throw new Exception('Product quantity not found');
                }

                // Check if the requested quantity is available
                if ($quantity->quantity < $productOrder['quantity']) {
                    throw new Exception('The products are not enough');
                }

                // Calculate total price for this product order
                $productTotalPrice = $product->price * $productOrder['quantity'];

                // Create ProductOrder
                $createProductOrder = new ProductOrder;
                $createProductOrder->order_id = $createCommand->id;
                $createProductOrder->product_id = $product->id;
                $createProductOrder->quantity_id = $quantity->id;
                $createProductOrder->quantity = $productOrder['quantity'];
                $createProductOrder->totalPrice = $productTotalPrice;
                $createProductOrder->isDeleted = 0;
                $createProductOrder->save();

                $totalPriceForOrder += $createProductOrder->totalPrice;

                if (!$createProductOrder->id) {
                    throw new Exception('Failed to create product order');
                }

                // Update the quantity
                $quantity->quantity -= $productOrder['quantity'];
                $quantity->save();

                // Update the Totalquantity in the products table
                $product->Totalquantity -= $productOrder['quantity'];
                $product->save();
            }

            // Update the total price for the order
            $createCommand->total_price = $totalPriceForOrder;
            $createCommand->save();

            $user = auth()->user();

            if ($user->role == 'employee') {
                $OrderLog = new LogOders();
                $OrderLog->order_id = $createCommand->id;
                $OrderLog->user_id = $user->id;
                $OrderLog->action = 'order Created';
                $OrderLog->save();
            }

            // Commit the transaction
            DB::commit();

            return response()->json([
                'message' => 'Data have been saved successfully',
                'employee With Min count' => $employeeWithMinCycleJob,
            ], 201);
        } catch (Exception $e) {
            // Rollback the transaction
            DB::rollBack();

            return response()->json(['message' => 'Something went wrong', 'error' => $e->getMessage()], 500);
        }
    }



    public function UpdateClientOrder(Request $request)
    {
        DB::beginTransaction();

        try {
            // Find the existing order
            $order = Orders::find($request->order_id);

            if (!$order) {
                return response()->json(['error' => 'Order not found'], 404);
            }

            $client = Client::find($order->client_id);

            if (!$client) {
                return response()->json(['error' => 'Client not found'], 404);
            }

            $address = Address::find($client->addresse_id);

            if (!$address) {
                return response()->json(['error' => 'Address not found'], 404);
            }

            $user = auth()->user();

            // Update client and address details
            $address->wilaya = $request->wilaya;
            $address->common = $request->common;
            $address->adress = $request->adress;
            $address->save();

            $client->first_name = $request->first_name;
            $client->last_name = $request->last_name;
            $client->phone_1 = $request->phone_1;
            $client->phone_2 = $request->phone_2;
            $client->save();

            $order->status = $request->status;
            $order->save();

            // if ($user->role == 'employee') {
            //     $OrderLog = new LogOders();
            //     $OrderLog->order_id = $order->id;
            //     $OrderLog->user_id = $user->id;
            //     $OrderLog->action = `order ${$request->status}`;
            //     $OrderLog->save();
            // }


            // Initialize total price to the current order total price
            $totalPriceForOrder = $order->total_price;

            foreach ($request->product_orders as $productOrder) {
                $status = $productOrder['flag'];
                $product = Product::find($productOrder['product_id']);
                if (!$product) {
                    throw new Exception('Product not found');
                }

                $quantity = Quantity::where('product_id', $product->id)
                    ->where('size_id', $productOrder['size_id'])
                    ->where('product_color_id', $productOrder['product_color_id'])
                    ->first();

                if (!$quantity) {
                    throw new Exception('Product quantity not found');
                }

                if ($status == 'new') {
                    // Create new ProductOrder
                    if ($quantity->quantity < $productOrder['quantity']) {
                        throw new Exception('The products are not enough');
                    }

                    $productTotalPrice = $product->price * $productOrder['quantity'];

                    $createProductOrder = new ProductOrder;
                    $createProductOrder->order_id = $order->id;
                    $createProductOrder->product_id = $product->id;
                    $createProductOrder->quantity_id = $quantity->id;
                    $createProductOrder->quantity = $productOrder['quantity'];
                    $createProductOrder->totalPrice = $productTotalPrice;
                    $createProductOrder->isDeleted = 0;
                    $createProductOrder->save();

                    $totalPriceForOrder += $createProductOrder->totalPrice;

                    $quantity->quantity -= $productOrder['quantity'];
                    $quantity->save();

                    $product->Totalquantity -= $productOrder['quantity'];
                    $product->save();




                    if ($user->role == 'employee') {
                        $OrderLog = new LogOders();
                        $OrderLog->order_id = $order->id;
                        $OrderLog->user_id = $user->id;
                        $OrderLog->action = 'New order';
                        $OrderLog->save();
                    }
                } elseif ($status == 'delete') {
                    // Find the specific ProductOrder to delete
                    $deleteProductOrder = ProductOrder::where('order_id', $order->id)
                        ->where('product_id', $product->id)
                        ->where('quantity_id', $quantity->id)
                        ->first();

                    if (!$deleteProductOrder) {
                        throw new Exception('ProductOrder not found');
                    }

                    if ($deleteProductOrder->isDeleted) {
                        throw new Exception('ProductOrder is already deleted');
                    }

                    // Update product and quantity totals
                    $product->Totalquantity += $deleteProductOrder->quantity;
                    $product->save();

                    $quantity->quantity += $deleteProductOrder->quantity;
                    $quantity->save();

                    // Adjust the total price for the order
                    $totalPriceForOrder -= $deleteProductOrder->totalPrice;

                    // Mark the ProductOrder as deleted

                    if ($totalPriceForOrder == 0) {
                        $order->isDeleted = 1;
                        $order->save();
                    }

                    $deleteProductOrder->isDeleted = 1;
                    $deleteProductOrder->quantity = 0;
                    $deleteProductOrder->save();

                    if ($user->role == 'employee') {
                        $OrderLog = new LogOders();
                        $OrderLog->order_id = $order->id;
                        $OrderLog->user_id = $user->id;
                        $OrderLog->action = 'order deleted';
                        $OrderLog->save();
                    }


                } elseif ($status == 'update') {
                    // Update existing ProductOrder
                    $existingProductOrder = ProductOrder::where('order_id', $order->id)
                        ->where('product_id', $product->id)
                        ->where('quantity_id', $quantity->id)
                        ->first();

                    if (!$existingProductOrder) {
                        throw new Exception('ProductOrder not found');
                    }

                    $oldQuantityValue = $existingProductOrder->quantity;
                    $newQuantityValue = $productOrder['quantity'];
                    $quantityDifference = $newQuantityValue - $oldQuantityValue;

                    if ($quantityDifference == 0) {
                        continue;
                    }

                    if ($quantityDifference > 0) {
                        if ($quantity->quantity < $quantityDifference) {
                            throw new Exception('Not enough stock available');
                        }

                        $existingProductOrder->quantity = $newQuantityValue;
                        $existingProductOrder->totalPrice = $product->price * $newQuantityValue;
                        $existingProductOrder->isDeleted = 0;
                        $existingProductOrder->save();

                        $quantity->quantity -= $quantityDifference;
                        $quantity->save();

                        $product->Totalquantity -= $quantityDifference;
                        $product->save();
                    } elseif ($quantityDifference < 0) {
                        $quantityDifference = abs($quantityDifference);

                        $existingProductOrder->quantity = $newQuantityValue;
                        $existingProductOrder->totalPrice = $product->price * $newQuantityValue;
                        $existingProductOrder->isDeleted = 0;
                        $existingProductOrder->save();

                        $quantity->quantity += $quantityDifference;
                        $quantity->save();

                        $product->Totalquantity += $quantityDifference;
                        $product->save();
                    }

                    $totalPriceForOrder += $product->price * $newQuantityValue;

                    if ($user->role == 'employee') {
                        $OrderLog = new LogOders();
                        $OrderLog->order_id = $order->id;
                        $OrderLog->user_id = $user->id;
                        $OrderLog->action = 'order updated';
                        $OrderLog->save();
                    }

                }
            }

            // Update the order's total price
            $order->total_price = $totalPriceForOrder;
            $order->save();

            DB::commit();

            return response()->json(['message' => 'Order updated successfully'], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to update order', 'error' => $e->getMessage()], 500);
        }
    }








    // public function DeleteClientOrder(Request $request, $id)
    // {
    //     DB::beginTransaction();

    //     try {
    //         // Find the product
    //         $product = Product::find($request->product_id);

    //         if (!$product) {
    //             return response()->json(['error' => 'Product not found'], 404);
    //         }

    //         // Find the product orders
    //         $deleteProductOrders = ProductOrder::where('order_id', $id)
    //             ->where('product_id', $product->id)
    //             ->get();

    //         // Mark each product order as deleted
    //         foreach ($deleteProductOrders as $deleteProductOrder) {
    //             $deleteProductOrder->isDeleted = 1;
    //             $deleteProductOrder->save();
    //         }

    //         // Find the order
    //         $deleteOrder = Orders::findOrFail($id);
    //         // Optionally, mark the order as deleted if all product orders are deleted
    //         $deleteOrder->isDeleted = 1;
    //         $deleteOrder->save();

    //         // Log the order deletion if the user is an employee
    //         $user = auth()->user();

    //         if ($user->role == 'employee') {
    //             $OrderLog = new LogOders();
    //             $OrderLog->order_id = $deleteOrder->id;
    //             $OrderLog->user_id = $user->id;
    //             $OrderLog->action = 'orders deleted';
    //             $OrderLog->save();
    //         }

    //         // Commit the transaction
    //         DB::commit();

    //         return response()->json(['message' => 'Data have been deleted successfully'], 200);
    //     } catch (Exception $e) {
    //         // Rollback the transaction
    //         DB::rollBack();

    //         return response()->json(['message' => 'Something went wrong', 'error' => $e->getMessage()], 500);
    //     }
    // }



    public function DeleteClientOrder(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            // Find the existing order
            $order = Orders::find($id);

            if (!$order) {
                return response()->json(['error' => 'Order not found'], 404);
            }

            // Check if the order is already deleted
            if ($order->isDeleted) {
                return response()->json(['message' => 'Order already deleted'], 400);
            }

            // Find the product orders associated with the order
            $productOrders = ProductOrder::where('order_id', $order->id)->get();

            // Iterate through each product order and mark them as deleted
            foreach ($productOrders as $productOrder) {
                $product = Product::find($productOrder->product_id);
                if (!$product) {
                    throw new Exception('Product not found');
                }

                $quantity = Quantity::find($productOrder->quantity_id);
                if (!$quantity) {
                    throw new Exception('Product quantity not found');
                }

                // Update product and quantity totals
                $product->Totalquantity += $productOrder->quantity;
                $product->save();

                $quantity->quantity += $productOrder->quantity;
                $quantity->save();

                // Mark the ProductOrder as deleted and set quantity to 0
                $productOrder->isDeleted = 1;
                $productOrder->quantity = 0;
                $productOrder->save();
            }

            // Mark the order as deleted
            $order->isDeleted = 1;
            $order->total_price = 0; // Set total price to 0 if required
            $order->status == 'Cancelled';
            $order->save();

            // Log the order deletion if the user is an employee
            $user = auth()->user();

            if ($user->role == 'employee') {
                $OrderLog = new LogOders();
                $OrderLog->order_id = $order->id;
                $OrderLog->user_id = $user->id;
                $OrderLog->action = 'order deleted';
                $OrderLog->save();
            }

            // Commit the transaction
            DB::commit();

            return response()->json(['message' => 'Order deleted successfully'], 200);
        } catch (Exception $e) {
            // Rollback the transaction
            DB::rollBack();

            return response()->json(['message' => 'Something went wrong', 'error' => $e->getMessage()], 500);
        }
    }




    public function CreateProduct(Request $request)
    {
        $test = false;

        DB::beginTransaction();

        $is_discounteds = filter_var($request->input('is_discounted'), FILTER_VALIDATE_BOOLEAN) ? true : false;
        try {
            // Create Product
            $createProduct = new Product();
            $createProduct->category_id = (int)$request->input('category_id');
            $createProduct->product_name = $request->input('product_name');
            $createProduct->description = $request->input('description');
            $createProduct->price = (float)$request->input('price');
            // $createProduct->quantity = (int)$request->input('quantity');
            $is_discounted = filter_var($request->input('is_discounted'), FILTER_VALIDATE_BOOLEAN) ? true : false;
            $createProduct->is_discounted = $is_discounted;
            $is_drafted = filter_var($request->input('is_drafted'), FILTER_VALIDATE_BOOLEAN) ? true : false;
            $createProduct->is_drafted = $is_drafted;

            $createProduct->save();
            $productId = $createProduct->id;

            if ($is_discounted) {
                // Create a new discount
                $createDiscount = new Discount();
                $createDiscount->product_id = $productId;
                $createDiscount->duration = $request->input('duration');
                //amount is the New Price
                $createDiscount->amount = (float)$request->input('new_price');
                $createDiscount->save();
                $createProduct->save();
            }

            $totalQuantity = 0;

            //  // Create Quantity instances
            foreach (json_decode($request->input('quantities'), true) as $quantityData) {
                $createQuantity = new Quantity();
                $createQuantity->product_id = $productId;
                $createQuantity->size_id = isset($quantityData['size_id']) ? (int)$quantityData['size_id'] : null;
                $createQuantity->product_color_id = isset($quantityData['product_color_id']) ? (int)$quantityData['product_color_id'] : null;
                $createQuantity->quantity = (int)$quantityData['quantity'];
                $createQuantity->save();

                $totalQuantity = $totalQuantity + $createQuantity->quantity;
            }

            $createProduct->Totalquantity = $totalQuantity;
            $createProduct->save();



            // Handle image upload for MainImage
            $uploadedImages = [];
            $mainImageSet = false; // Flag to track if main image is set

            foreach ($request->file('images') as $index => $image) {
                // Store the uploaded image in the public disk
                $imagePath = $image->store('images', 'public');

                // Get image details
                $imageName = $image->getClientOriginalName();
                $imageSize = $image->getSize();
                $imageExtension = $image->getClientOriginalExtension(); // Get file extension

                // Create Product Image
                $createProductImage = new ProductImage();
                $createProductImage->product_id = $productId;
                $createProductImage->image = $imagePath;

                // Set is_main flag for the first image only
                if (!$mainImageSet && $index === 0) {
                    $createProductImage->is_main = true;
                    $mainImageSet = true;
                } else {
                    $createProductImage->is_main = false;
                }

                $createProductImage->save();

                // Prepare response data for the uploaded image
                // $uploadedImages[] = [
                //     'name' => $imageName,
                //     'size' => $imageSize, // Helper function to format size if needed
                //     'extension' => $imageExtension,
                //     'url' => asset('storage/' . $imagePath),
                //     'is_main' => $createProductImage->is_main
                // ];
            }

            DB::commit();

            // Prepare final payload with detailed image information
            $payload = [
                'message' => 'Data have been saved successfully',
                'test' => $is_discounteds,
            ];

            return response()->json($payload, 201);
        } catch (\Exception $e) {
            // If any operation fails, rollback the transaction
            DB::rollBack();

            return response()->json(['message' => 'Something went wrong ' . $is_discounteds, 'error' => $e->getMessage()], 500);
        }
    }






    public function GetProductImages($productId)
    {
        $productImages = ProductImage::where('product_id', $productId)->get();

        if ($productImages->isEmpty()) {
            return response()->json(['error' => 'No images found for this product'], 404);
        }

        $imageUrls = $productImages->map(function ($image) {
            return asset('storage/' . $image->image);
        });

        return response()->json([
            'message' => 'Images retrieved successfully',
            'image_urls' => $imageUrls,
        ], 200);
    }





    public function updateProduct(Request $request)
    {
        DB::beginTransaction();

        try {
            // $status = $request->flag;
            $product = Product::find($request->id);

            if (!$product) {
                return response()->json([
                    'message' => 'Product not found',
                    'product_id' => $request->id,
                    'product' => $product,
                ], 404);
            }

            // Update the product attributes
            $is_discounted = filter_var($request->input('is_discounted'), FILTER_VALIDATE_BOOLEAN);
            $is_drafted = filter_var($request->input('is_drafted'), FILTER_VALIDATE_BOOLEAN);

            $product->category_id = (int)$request->input('category_id');
            $product->product_name = $request->input('product_name');
            $product->description = $request->input('description');
            $product->price = (float)$request->input('price');
            $product->is_discounted = $is_discounted;
            $product->is_drafted = $is_drafted;
            $product->save();

            if ($is_discounted) {
                // Create a new discount or update existing
                $discount = Discount::where('product_id', $product->id)->first();
                if (!$discount) {
                    $discount = new Discount();
                    $discount->product_id = $product->id;
                }
                // $discount->duration = $request->input('duration');
                // Amount is the New Price
                $discount->amount = (float)$request->input('new_price');
                $discount->save();
            } else {
                Discount::where('product_id', $product->id)->delete();
            }

            $totalQuantity = 0;

            //convert the quantities to array


            $quantities = json_decode($request->input('quantities'), true);

            if (is_array($quantities)) {
                foreach ($quantities as $quantityData) {
                    $flag = $quantityData['flag'] ?? null;

                    switch ($flag) {
                        case 'update':
                            $quantity = Quantity::where('product_id', $product->id)
                                ->where('size_id', isset($quantityData['size_id']) ? (int)$quantityData['size_id'] : null)
                                ->where('product_color_id', isset($quantityData['product_color_id']) ? (int)$quantityData['product_color_id'] : null)
                                ->first();

                            if ($quantity) {
                                $quantity->quantity = (int)$quantityData['quantity'];
                                $quantity->save();

                                $totalQuantity += $quantity->quantity;
                            }
                            break;

                        case 'new':
                            // Delete existing quantities and create new ones
                            Quantity::where('product_id', $product->id)->delete();
                            foreach ($quantities as $newQuantityData) {
                                $createQuantity = new Quantity();
                                $createQuantity->product_id = $product->id;
                                $createQuantity->size_id = isset($newQuantityData['size_id']) ? (int)$newQuantityData['size_id'] : null;
                                $createQuantity->product_color_id = isset($newQuantityData['product_color_id']) ? (int)$newQuantityData['product_color_id'] : null;
                                $createQuantity->quantity = (int)$newQuantityData['quantity'];
                                $createQuantity->save();

                                $totalQuantity += $createQuantity->quantity;
                            }
                            break;

                        case 'delete':
                            // Delete all quantities associated with the specific product_id
                            Quantity::where('product_id', $product->id)->delete();
                            // Set the Totalquantity to 0 after deleting all quantities
                            $product->Totalquantity = 0;
                            break;

                        default:
                            // Handle any other cases if necessary
                            break;
                    }

                    // Update total quantity for the product
                    $product->Totalquantity = $totalQuantity;
                    $product->save();
                }
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'An error occurred while updating the product: Invalid quantities input'
                ]);
            }

            $mainImageSet = false; // Flag to track if main image is set
            //delete all images
            ProductImage::where('product_id', $product->id)->delete();
            foreach ($request->file('images') as $index => $image) {
                // Store the uploaded image in the public disk
                $imagePath = $image->store('images', 'public');

                // Create Product Image
                $createProductImage = new ProductImage();
                $createProductImage->product_id = $product->id;
                $createProductImage->image = $imagePath;

                // Set is_main flag for the first image only
                if (!$mainImageSet && $index === 0) {
                    $createProductImage->is_main = true;
                    $mainImageSet = true;
                } else {
                    $createProductImage->is_main = false;
                }

                $createProductImage->save();
            }

            DB::commit();

            return response()->json([
                'status' => true,
                // 'message' => $status == 'delete' ? 'Quantities deleted successfully' : ($status == 'new' ? 'Quantities created successfully' : 'Product updated successfully'),
                'product' => $product,
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => 'An error occurred while updating the product: ' . $e->getMessage()
                // 'message' => $status == 'delete' ? 'Failed to delete quantities: ' . $e->getMessage() : ($status == 'new' ? 'Failed to create quantities: ' . $e->getMessage() : 'Failed to update product: ' . $e->getMessage())
            ], 500);
        }
    }









    public function deleteProduct($id)
    {
        $deleteProduct = Product::find($id);

        if (!$deleteProduct) {
            return response()->json([
                'status' => false,
                'message' => 'Product not found with id: ' . $id
            ], 404);
        }

        try {
            $result = $deleteProduct->delete();

            if ($result) {
                return response()->json([
                    'status' => true,
                    'message' => 'Product deleted successfully',
                    'deleted_product_id' => $id
                ], 200);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to delete product with id: ' . $id
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while deleting the product: ' . $e->getMessage()
            ], 500);
        }
    }



    public function selledItems(Request $request)
    {
        $user = auth()->user();
        $order = Orders::find($request->id);

        // Check if the order exists
        if (!$order) {
            return response()->json([
                'status' => false,
                'message' => 'Order not found.'
            ], 404);
        }

        // If the user is an employee, check if the order is assigned to them
        if ($user->role === 'employee') {
            $employeeCycle = EmployeeCycle::where('order_id', $order->id)
                ->where('user_id', $user->id)
                ->first();

            if (!$employeeCycle) {
                return response()->json([
                    'status' => false,
                    'message' => 'This order is not assigned to you.'
                ], 403);
            }
        }

        if ($order->status !== 'confirmed' and $order->status !== 'pending') {

            $order->status = 'cancelled';
            $order->save();

            if ($user->role == 'employee') {
                $OrderLog = new LogOders();
                $OrderLog->order_id = $order->id;
                $OrderLog->user_id = $user->id;
                $OrderLog->action = 'cancelled order';
                $OrderLog->save();
            }
        }

        // Check if the order is not already confirmed
        if ($order->status !== 'confirmed') {
            $order->status = 'confirmed';
            $order->save();


            if ($user->role == 'employee') {
                $OrderLog = new LogOders();
                $OrderLog->order_id = $order->id;
                $OrderLog->user_id = $user->id;
                $OrderLog->action = 'confirmed order';
                $OrderLog->save();
            }


            // Find the associated product order for the given order ID
            $productOrder = ProductOrder::where('order_id', $request->id)->first();

            if ($productOrder) {
                // Create a new SelledItems record
                $createSelledItem = new SelledItems;
                $createSelledItem->order_id = $order->id;
                $createSelledItem->product_id = $productOrder->product_id;
                $createSelledItem->unitPrice = $request->unitPrice; // Assuming totalPrice represents unit price
                $createSelledItem->quantity = $productOrder->quantity;
                $createSelledItem->save();

                return response()->json([
                    'status' => true,
                    'message' => 'Order has been confirmed and selled items have been created.'
                ], 200);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Product order not found for the given order ID.'
                ], 404);
            }
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Order already confirmed.'
            ], 400);
        }
    }




    public function CreateCategory(Request $request)
    {
        try {
            // Validate the request data
            $request->validate([
                'CategoryName' => 'required|string|max:255|unique:categories,CategoryName',
            ]);

            // Create a new category
            $createCategory = new Category();
            $createCategory->CategoryName = $request->CategoryName;
            $createCategory->save();

            return response()->json([
                'status' => true,
                'message' => 'Category created successfully',
                'category' => $createCategory
            ], 201); // 201 Created
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422); // 422 Unprocessable Entity
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while creating the category',
                'error' => $e->getMessage()
            ], 500); // 500 Internal Server Error
        }
    }


    public function updateCategory(Request $request)
    {
        try {
            // Validate the request data
            $request->validate([
                'id' => 'required|exists:categories,id',
                'CategoryName' => 'required|string|max:255',
            ]);

            // Find the category by ID and update it
            $updateCategory = Category::find($request->id);
            $updateCategory->CategoryName = $request->CategoryName;
            $updateCategory->save();

            return response()->json([
                'status' => true,
                'message' => 'Category updated successfully',
                'category' => $updateCategory
            ], 200); // 200 OK
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422); // 422 Unprocessable Entity
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while updating the category',
                'error' => $e->getMessage()
            ], 500); // 500 Internal Server Error
        }
    }



    public function deleteCategory(Request $request, $id)
    {
        $deleteCategory = Category::find($id);

        if (!$deleteCategory) {
            return response()->json([
                'status' => false,
                'message' => 'deleteCategory not found with id: ' . $id
            ], 404);
        }

        try {
            $result = $deleteCategory->delete();

            if ($result) {
                return response()->json([
                    'status' => true,
                    'message' => 'deleteCategory deleted successfully',
                    'deleted_deleteCategory_id' => $id
                ], 200);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to delete deleteCategory with id: ' . $id
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while deleting the deleteCategory: ' . $e->getMessage()
            ], 500);
        }
    }


    public function createDiscount(Request $request)
    {
        // Find the product by its ID
        $product = Product::find($request->product_id);

        // Check if the product exists
        if (!$product) {
            return response()->json([
                'status' => false,
                'message' => 'Product not found'
            ], 404);
        }

        // Check if the product is already discounted
        if ($product->is_discounted) {
            return response()->json([
                'status' => false,
                'message' => 'Cannot apply discount. Product is already discounted.'
            ], 400);
        }


        // Create a new discount
        $createDiscount = new Discount;
        $createDiscount->product_id = $product->id;
        $createDiscount->duration = $request->duration;
        $createDiscount->amount = $request->amount;
        $createDiscount->save();


        $product->price = $product->price - $request->amount;

        // Update product discount status
        $product->is_discounted = true;
        $product->save();

        return response()->json([
            'status' => true,
            'message' => 'Discount has been applied successfully.'
        ], 201); // Use appropriate HTTP status code for success (e.g., 201 for created)
    }



    public function discountUpdate(Request $request)
    {
        // Find the discount by its ID
        $discount = Discount::find($request->id);

        // Check if the discount exists
        if (!$discount) {
            return response()->json([
                'status' => false,
                'message' => 'Discount not found'
            ], 404);
        }

        // Validate request data
        $validatedData = $request->validate([
            'duration' => 'required|integer',
        ]);

        // Update the discount duration
        $discount->duration = $validatedData['duration'];
        $discount->save();

        return response()->json([
            'status' => true,
            'message' => 'Discount has been updated successfully.'
        ], 200); // Use appropriate HTTP status code for success (e.g., 200 OK)
    }


    public function deleteDiscount($id, Request $request)
    {
        // Find the discount by its ID
        $discount = Discount::find($id);

        // Check if the discount exists
        if (!$discount) {
            return response()->json([
                'status' => false,
                'message' => 'Discount not found'
            ], 404);
        }

        // Attempt to delete the discount
        try {
            $result = $discount->delete();

            if ($result) {
                return response()->json([
                    'status' => true,
                    'message' => 'Discount with ID ' . $id . ' has been deleted successfully.'
                ], 200);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to delete the discount with ID ' . $id
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while deleting the discount.'
            ], 500);
        }
    }


    // OrderList

   public function orderList(Request $request)
{
    try {
        $user = auth()->user();

        // Get the page number from the query parameter, default to 1 if not provided
        $page = $request->query('page', 1);

        // Calculate the offset based on the page number
        $offset = ($page - 1) * 10;

        // Initialize the base query for orders
        $baseQuery = DB::table('orders')
            ->join('clients', 'orders.client_id', '=', 'clients.id')
            ->join('addresses', 'clients.addresse_id', '=', 'addresses.id')
            ->select('orders.*', 'clients.first_name', 'clients.last_name', 'addresses.wilaya');

        if ($user->role === 'admin') {
            // Apply filters to the base query
            if ($request->has('query')) {
                $searchQuery = $request->input('query');
                $baseQuery = $baseQuery->where(function ($query) use ($searchQuery) {
                    $query->where('addresses.wilaya', 'like', '%' . $searchQuery . '%')
                          ->orWhere('orders.isDeleted', 'like', '%' . $searchQuery . '%')
                          ->orWhere('orders.status', 'like', '%' . $searchQuery . '%');
                });
            }

            // Apply additional filters if present and not empty
            if ($request->filled('wilaya')) {
                $baseQuery->where('addresses.wilaya', 'like', '%' . $request->input('wilaya') . '%');
            }

            if ($request->filled('isDeleted')) {
                $baseQuery->where('orders.isDeleted', $request->input('isDeleted'));
            }

            if ($request->filled('status')) {
                $baseQuery->where('orders.status', 'like', '%' . $request->input('status') . '%');
            }
        } elseif ($user->role === 'employee') {
            // If user is an employee, fetch only the orders assigned to them
            $employeeId = $user->id;

            // Apply filters to the base query
            if ($request->has('query')) {
                $searchQuery = $request->input('query');
                $baseQuery = $baseQuery->where(function ($query) use ($searchQuery) {
                    $query->where('addresses.wilaya', 'like', '%' . $searchQuery . '%')
                          ->orWhere('orders.isDeleted', 'like', '%' . $searchQuery . '%')
                          ->orWhere('orders.status', 'like', '%' . $searchQuery . '%');
                });
            }

            $baseQuery = $baseQuery->join('employee_cycles', 'orders.id', '=', 'employee_cycles.order_id')
                                   ->where('employee_cycles.user_id', $employeeId)
                                   ->where('orders.status', 'pending');

            // Apply additional filters if present and not empty
            if ($request->filled('wilaya')) {
                $baseQuery->where('addresses.wilaya', 'like', '%' . $request->input('wilaya') . '%');
            }

            if ($request->filled('isDeleted')) {
                $baseQuery->where('orders.isDeleted', $request->input('isDeleted'));
            }

            if ($request->filled('status')) {
                $baseQuery->where('orders.status', 'like', '%' . $request->input('status') . '%');
            }
        } else {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        // Get the total rows for pagination before applying offset and limit
        $totalRows = $baseQuery->count();

        // Apply pagination
        //

        if($user->role === 'employee'){
            $orders = $baseQuery->where('orders.isDeleted','0')->offset($offset)->limit(10)->get();
        }else{
            $orders = $baseQuery->offset($offset)->limit(10)->get();
        }


        return response()->json([
            'data' => $orders,
            'total_rows' => $totalRows,
        ]);
    } catch (Exception $e) {
        return response()->json([
            'message' => 'An error occurred while retrieving data',
            'error' => $e->getMessage(),
        ], 500);
    }
}







    public function orderListState(Request $request)
    {
        // Define the number of orders per page (you can adjust this as needed)
        $perPage = $request->input('per_page', 5); // Default to 10 orders per page

        // Fetch paginated orders
        $orders = Orders::select('status')->paginate($perPage);

        // Return paginated orders as JSON response
        return response()->json($orders);
    }

    public function clientAndorders(Request $request)
    {
        $perPage = $request->input('per_page', 5);

        $clientOrders = DB::table('clients')
            ->join('orders', 'clients.id', '=', 'orders.client_id')
            ->select('clients.*', 'orders.status', 'orders.total_price')
            ->paginate($perPage);

        return response()->json($clientOrders);
    }

    public function getOrderStatistics(): JsonResponse
    {
        // Define the date threshold for old orders
        $dateThreshold = Carbon::now()->subDays(30)->toDateString();

        // Delete orders older than 30 days
        try {
            Orders::whereDate('created_at', '<', $dateThreshold)->delete();
        } catch (Exception $e) {
            return response()->json(['message' => 'Failed to delete old orders', 'error' => $e->getMessage()], 500);
        }

        // Calculate statistics
        $today = Carbon::now()->toDateString();
        $lastWeek = Carbon::now()->subDays(7)->toDateString();
        $lastMonth = Carbon::now()->subMonth()->toDateString();

        $confirmedToday = Orders::where('status', 'confirmed')
            ->whereDate('created_at', $today)
            ->count();

        $confirmedLastWeek = Orders::where('status', 'confirmed')
            ->whereDate('created_at', '>=', $lastWeek)
            ->whereDate('created_at', '<=', $today)
            ->count();

        $confirmedLastMonth = Orders::where('status', 'confirmed')
            ->whereDate('created_at', '>=', $lastMonth)
            ->whereDate('created_at', '<=', $today)
            ->count();

        $cancelledToday = Orders::where('status', 'cancelled')
            ->whereDate('created_at', $today)
            ->count();

        $cancelledLastWeek = Orders::where('status', 'cancelled')
            ->whereDate('created_at', '>=', $lastWeek)
            ->whereDate('created_at', '<=', $today)
            ->count();

        $cancelledLastMonth = Orders::where('status', 'cancelled')
            ->whereDate('created_at', '>=', $lastMonth)
            ->whereDate('created_at', '<=', $today)
            ->count();

        $pendingOrders = Orders::where('status', 'pending')->count();

        $statistics = [
            'confirmed_today' => $confirmedToday,
            'confirmed_last_week' => $confirmedLastWeek,
            'confirmed_last_month' => $confirmedLastMonth,
            'cancelled_today' => $cancelledToday,
            'cancelled_last_week' => $cancelledLastWeek,
            'cancelled_last_month' => $cancelledLastMonth,
            'pending_orders' => $pendingOrders,
        ];

        return response()->json($statistics);
    }


    public function Discounts(Request $request)
    {
        try {
            $user = auth()->user();

            if ($user->role === 'admin') {
                // Get the page number from the query parameter, default to 1 if not provided
                $page = $request->query('page', 1);

                // Calculate the offset based on the page number
                $offset = ($page - 1) * 10;

                // Initialize the base query for discounts
                $baseQuery = DB::table('discounts');

                if ($request->has('query')) {
                    $searchQuery = $request->input('query');

                    if (strtolower($searchQuery) === 'all' || strtolower($searchQuery) === 'tout') {
                        $baseQuery = $baseQuery->offset($offset)->limit(10);
                    } else {
                        $baseQuery = $baseQuery->where(function ($query) use ($searchQuery) {
                            $query->where('duration', 'like', '%' . $searchQuery . '%');
                        })->offset($offset)->limit(10);
                    }
                } else {
                    $baseQuery = $baseQuery->offset($offset)->limit(10);
                }

                // Get the total rows for pagination
                $totalRows = $baseQuery->count();

                // Fetch the paginated results
                $discounts = $baseQuery->get();

                return response()->json([
                    'data' => $discounts,
                    'total_rows' => $totalRows,
                ]);
            } else {
                return response()->json([
                    'message' => 'Unauthorized',
                ], 403);
            }
        } catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while retrieving data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function ColorsAndSizes(Request $request)
    {
        try {
            $user = auth()->user();

            if ($user->role === 'admin' or $user->role === 'employee') {
                // Fetch all colors and sizes without pagination and search query
                $colors = DB::table('product_colors')->get()->map(function ($color) {
                    return [
                        'id' => $color->id,
                        'value' => $color->color_name,
                        'hex' => $color->value,
                    ];
                });

                $sizes = DB::table('sizes')->get()->map(function ($size) {
                    return [
                        'id' => $size->id,
                        'value' => $size->size,
                    ];
                });
                $colorss = DB::table('product_colors')->get();

                return response()->json([
                    'colors' => $colors,
                    'sizes' => $sizes,
                    'colorss' => $colorss,
                ]);
            } else {
                return response()->json([
                    'message' => 'Unauthorized',
                ], 403);
            }
        } catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while retrieving data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function order($id)
    {
        // Join tables and select the required fields
        $orderData = DB::table('product_orders')
            ->join('orders', 'product_orders.order_id', '=', 'orders.id')
            ->join('clients', 'orders.client_id', '=', 'clients.id')
            ->join('addresses', 'clients.addresse_id', '=', 'addresses.id')
            ->join('products', 'product_orders.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->join('quantities', 'product_orders.quantity_id', '=', 'quantities.id')
            ->join('product_colors', 'quantities.product_color_id', '=', 'product_colors.id')
            ->join('sizes', 'quantities.size_id', '=', 'sizes.id')
            ->select(
                'orders.id as order_id',
                'orders.client_id',
                'orders.status',
                'orders.total_price',
                'orders.isDeleted',
                'orders.created_at',
                'orders.updated_at',
                'clients.first_name',
                'clients.last_name',
                'clients.phone_1',
                'clients.phone_2',
                'addresses.wilaya',
                'addresses.common',
                'addresses.adress',
                'product_orders.product_id',
                'quantities.size_id', // Changed from product_orders.size_id to quantities.size_id
                'quantities.product_color_id', // Changed from product_orders.product_color_id to quantities.product_color_id
                'product_orders.quantity',
                'product_orders.totalPrice as totalPriceOrderProduct',
                'products.product_name',
                'products.description',
                'products.price as product_price',
                'categories.CategoryName',
                'product_colors.color_name',
                'sizes.size'
            )
            ->where('orders.id', $id)
            ->where('product_orders.isDeleted', 0)
            ->get();

        // Transform the data
        $order = null;
        $productOrders = [];

        foreach ($orderData as $data) {
            if (!$order) {
                $order = [
                    'id' => $data->order_id,
                    'client_id' => $data->client_id,
                    'status' => $data->status,
                    'total_price' => $data->total_price,
                    'isDeleted' => $data->isDeleted,
                    'created_at' => $data->created_at,
                    'updated_at' => $data->updated_at,
                    'first_name' => $data->first_name,
                    'last_name' => $data->last_name,
                    'phone_1' => $data->phone_1,
                    'phone_2' => $data->phone_2,
                    'wilaya' => $data->wilaya,
                    'common' => $data->common,
                    'adress' => $data->adress,
                    'product_orders' => []
                ];
            }

            $order['product_orders'][] = [
                'product_id' => $data->product_id,
                'size_id' => $data->size_id,
                'product_color_id' => $data->product_color_id,
                'quantity' => $data->quantity,
                'totalPriceOrderProduct' => $data->totalPriceOrderProduct,
                'product_name' => $data->product_name,
                'description' => $data->description,
                'product_price' => $data->product_price,
                'CategoryName' => $data->CategoryName,
                'color_name' => $data->color_name,
                'size' => $data->size,
            ];
        }

        return response()->json($order);
    }




    public function Product($productId)
    {
        try {
            $user = auth()->user();
            if ($user->role === 'admin' || $user->role === 'employee') {
                // Fetch the product details with joins and ensure distinct results
                $product = Product::where('products.id', $productId)
                    ->join('categories', 'products.category_id', '=', 'categories.id')
                    ->select('products.*', 'categories.CategoryName', 'categories.id as category_id')
                    ->distinct()
                    ->first();

                if (!$product) {
                    return response()->json([
                        'message' => 'Product not found',
                    ], 404);
                }

                // Cast is_drafted and is_discounted to boolean
                $product->is_drafted = (bool) $product->is_drafted;
                $product->is_discounted = (bool) $product->is_discounted;

                if ($product->is_discounted) {
                    // Fetch the discount details for the product
                    $discount = Discount::where('product_id', $productId)->select('amount')->first();
                    $product->discount_amount = $discount ? $discount->amount : null;
                }

                // Fetch quantities with sizes and colors
                $quantities = Quantity::where('product_id', $productId)
                    ->join('sizes', 'quantities.size_id', '=', 'sizes.id')
                    ->join('product_colors', 'quantities.product_color_id', '=', 'product_colors.id')
                    ->select(
                        'quantities.id',
                        'sizes.id as size_id',
                        'sizes.size as size_label',
                        'product_colors.id as color_id',
                        'product_colors.color_name as color_label',
                        'product_colors.value as color_hex',
                        'quantities.quantity'
                    )
                    ->get();

                // Transform quantities to the desired format
                $formattedQuantities = $quantities->map(function ($quantity) {
                    return [
                        'id' => $quantity->id,
                        'color' => [
                            'id' => $quantity->color_id,
                            'label' => $quantity->color_label,
                            'hex' => $quantity->color_hex,
                        ],
                        'quantity' => $quantity->quantity,
                        'size' => [
                            'id' => $quantity->size_id,
                            'label' => $quantity->size_label,
                        ],
                        'flag' => 'default',
                    ];
                });

                // Fetch product images for the specific product
                $productImages = ProductImage::where('product_id', $product->id)->get();
                $imageFiles = $productImages->map(function ($image) {
                    $imagePath = storage_path('app/public/' . $image->image);
                    if (file_exists($imagePath)) {
                        return [
                            'filename' => basename($imagePath),
                            'filetype' => mime_content_type($imagePath),
                            'base64' => base64_encode(file_get_contents($imagePath)),
                        ];
                    }
                    return null;
                })->filter();

                // Add image files to the product object
                $product->images = $imageFiles;

                // Add formatted quantities to the product object
                $product->quantities = $formattedQuantities;

                return response()->json([
                    'data' => $product,
                ]);
            } else {
                return response()->json([
                    'message' => 'Unauthorized',
                ], 403);
            }
        } catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while retrieving data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

//     public function Product($productId)
// {
//     try {
//         $user = auth()->user();
//         if ($user->role === 'admin' || $user->role === 'employee') {
//             // Fetch the product details with joins and ensure distinct results
//             $product = Product::where('products.id', $productId)
//                 ->join('categories', 'products.category_id', '=', 'categories.id')
//                 ->select('products.*', 'categories.CategoryName', 'categories.id as category_id')
//                 ->distinct()
//                 ->first();

//             if (!$product) {
//                 return response()->json([
//                     'message' => 'Product not found',
//                 ], 404);
//             }

//             // Cast is_drafted and is_discounted to boolean
//             $product->is_drafted = (bool) $product->is_drafted;
//             $product->is_discounted = (bool) $product->is_discounted;

//             if ($product->is_discounted) {
//                 // Fetch the discount details for the product
//                 $discount = Discount::where('product_id', $productId)->select('amount')->first();
//                 $product->discount_amount = $discount ? $discount->amount : null;
//             }

//             // Fetch quantities with sizes and colors
//             $quantities = Quantity::where('product_id', $productId)
//                 ->join('sizes', 'quantities.size_id', '=', 'sizes.id')
//                 ->join('product_colors', 'quantities.product_color_id', '=', 'product_colors.id')
//                 ->select(
//                     'quantities.id',
//                     'sizes.id as size_id',
//                     'sizes.size as size_label',
//                     'product_colors.id as color_id',
//                     'product_colors.color_name as color_label',
//                     'product_colors.value as color_hex',
//                     'quantities.quantity'
//                 )
//                 ->get();

//             // Transform quantities to the desired format
//             $formattedQuantities = $quantities->map(function ($quantity) {
//                 return [
//                     'id' => $quantity->id,
//                     'color' => [
//                         'id' => $quantity->color_id,
//                         'label' => $quantity->color_label,
//                         'hex' => $quantity->color_hex,
//                     ],
//                     'quantity' => $quantity->quantity,
//                     'size' => [
//                         'id' => $quantity->size_id,
//                         'label' => $quantity->size_label,
//                     ],
//                     'flag' => 'default',
//                 ];
//             });

//             // Fetch product images for the specific product
//             $productImages = ProductImage::where('product_id', $product->id)->get();
//             $imageUrls = $productImages->map(function ($image) {
//                 return asset('storage/' . $image->image);
//             });

//             // Add image_urls to the product object
//             $product->image_urls = $imageUrls;

//             // Add formatted quantities to the product object
//             $product->quantities = $formattedQuantities;

//             return response()->json([
//                 'data' => $product,
//             ]);
//         } else {
//             return response()->json([
//                 'message' => 'Unauthorized',
//             ], 403);
//         }
//     } catch (Exception $e) {
//         return response()->json([
//             'message' => 'An error occurred while retrieving data',
//             'error' => $e->getMessage(),
//         ], 500);
//     }
// }

    public function Products(Request $request)
    {
        try {
            $user = auth()->user();
            if ($user->role === 'admin') {
                // Get the page number from the query parameter, default to 1 if not provided
                $page = $request->query('page', 1);
                // Calculate the offset based on the page number
                $offset = ($page - 1) * 10;
                // Initialize the base query for products with joins
                $baseQuery = DB::table('products')
                    ->join('categories', 'products.category_id', '=', 'categories.id')
                    ->leftJoin('discounts', 'products.id', '=', 'discounts.product_id')
                    ->select(
                        'products.*',
                        'categories.CategoryName',
                        'discounts.duration',
                        // Use conditional statement to set amount to 'N/A' if no discount exists
                        DB::raw('IF(discounts.id IS NULL, "N/A", discounts.amount) as amount'),
                        // Add a flag to indicate if a discount exists
                        DB::raw('IF(discounts.id IS NULL, false, true) as isDiscounted')
                    );

                // Apply filters to the base query
                if ($request->has('query')) {
                    $searchQuery = $request->input('query');
                    if (strtolower($searchQuery) !== 'all' && strtolower($searchQuery) !== 'tout') {
                        $baseQuery = $baseQuery->where(function ($query) use ($searchQuery) {
                            $query->where('products.product_name', 'like', '%' . $searchQuery . '%')
                                ->orWhere('products.is_drafted', 'like', '%' . $searchQuery . '%');
                        });
                    }
                }

                // Add the quantity filter
                //To Do quantity filter
                // if ($request->has('stock')) {
                //     $quantityFilter = $request->input('stock');
                //     if ($quantityFilter == 'out') {
                //         $baseQuery = $baseQuery->where('quantities.quantity', 0);
                //     } elseif ($quantityFilter == 'in') {
                //         $baseQuery = $baseQuery->where('quantities.quantity', '>', 0);
                //     }
                // }

                // Add the is_drafted filter
                if ($request->has('isDrafted')) {
                    $isDraftedFilter = $request->input('isDrafted');
                    if ($isDraftedFilter == 'true') {
                        $baseQuery = $baseQuery->where('products.is_drafted', true);
                    } elseif ($isDraftedFilter == 'false') {
                        $baseQuery = $baseQuery->where('products.is_drafted', false);
                    }
                }

                // Add the category filter by ID
                if ($request->has('category')) {
                    $categoryFilter = $request->input('category');
                    if (strtolower($categoryFilter) !== 'all') {
                        $baseQuery = $baseQuery->where('categories.id', $categoryFilter);
                    }
                }

                // Clone the base query for counting total filtered rows
                $totalFilteredRowsQuery = clone $baseQuery;

                // Get the total filtered rows
                $totalFilteredRows = $totalFilteredRowsQuery->count();

                // Apply pagination to the base query
                $baseQuery = $baseQuery->offset($offset)->limit(10);

                // Fetch the paginated results
                $products = $baseQuery->get()->map(function ($product) {
                    $product->is_drafted = (bool) $product->is_drafted;
                    $product->is_discounted = (bool) $product->is_discounted; // Cast is_discounted to boolean
                    return $product;
                });

                return response()->json([
                    'data' => $products,
                    'total_rows' => $totalFilteredRows,
                ]);
            } else {
                return response()->json([
                    'message' => 'Unauthorized',
                ], 403);
            }
        } catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while retrieving data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function GetProductLandingPage(Request $request)
    {
        try {
            // Get the page number from the query parameter, default to 1 if not provided
            $page = $request->query('page', 1);
            // Calculate the offset based on the page number
            $offset = ($page - 1) * 10;
            // Initialize the base query for products with joins
            $baseQuery = DB::table('products')
                ->join('categories', 'products.category_id', '=', 'categories.id')
                ->join('product_images', function ($join) {
                    $join->on('products.id', '=', 'product_images.product_id')
                        ->where('product_images.is_main', true);
                })
                ->select('products.*', 'categories.CategoryName');
            // Check if we need to join the discounts table
            $joinDiscounts = false;
            if ($request->has('query')) {
                $searchQuery = $request->input('query');
                if (strtolower($searchQuery) === 'all' || strtolower($searchQuery) === 'tout') {
                    $baseQuery = $baseQuery->offset($offset)->limit(10);
                } else {
                    $baseQuery = $baseQuery->where(function ($query) use ($searchQuery) {
                        $query->where('products.is_discounted', 'like', '%' . $searchQuery . '%');
                    })->offset($offset)->limit(10);
                    if (strtolower($searchQuery) == 1) {
                        $joinDiscounts = true;
                    }
                }
            } else {
                $baseQuery = $baseQuery->offset($offset)->limit(10);
            }
            // Conditionally join the discounts table
            $baseQuery = $baseQuery
                ->leftJoin('discounts', 'products.id', '=', 'discounts.product_id')
                ->addSelect('discounts.amount as discount_amount');

            // Get the total rows for pagination
            $totalRows = DB::table('products')->count();
            // Fetch the paginated results
            $products = $baseQuery->get();
            // Process the results to set is_discounted to boolean and collect amount field
            $productsWithImages = $products->map(function ($product) {
                $productImage = ProductImage::where('product_id', $product->id)
                    ->where('is_main', true)
                    ->first(); // Fetch the first main image
                // Add image_url to the product object
                $product->image_url = $productImage ? asset('storage/' . $productImage->image) : null;
                // Check if the product is in stock
                $product->isInStock = $product->Totalquantity > 0;
                // Set is_discounted to boolean
                $product->is_discounted = (bool) $product->is_discounted;
                // Collect the discount amount if available
                $product->discount_amount = $product->is_discounted ? $product->discount_amount : null;
                // Calculate the discount percentage
                if ($product->is_discounted && $product->price > 0) {
                    $product->discount_percentage = round(100 - ($product->discount_amount / $product->price) * 100, 2);
                } else {
                    $product->discount_percentage = null;
                }
                return $product;
            });
            return response()->json([
                'data' => $productsWithImages,
                'total_rows' => $totalRows,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while retrieving data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function Discount($id)
    {

        $dicount = Discount::find($id);

        return response()->json($dicount);
    }

    public function user()
    {
        $authUser = auth()->user();

        if ($authUser) {
            $user = User::find($authUser->id);
            if ($user) {
                return response()->json($user);
            } else {
                return response()->json(['error' => 'User not found'], 404);
            }
        } else {
            return response()->json(['error' => 'Not authenticated'], 401);
        }
    }


    public function cycle(Request $request)
    {
        DB::beginTransaction();

        try {
            // Retrieve the employee with the lowest cyclejob
            $employeeWithMinCycleJob = User::where('role', 'employee')
                ->orderBy('count', 'asc')
                ->first();

            // Check if an employee with min cyclejob is found
            if (!$employeeWithMinCycleJob) {
                return response()->json(['message' => 'No employees found'], 404);
            }

            // Retrieve the first untreated order
            $untreatedOrder = Orders::where('status', 'pending')->first();

            // Check if an untreated order is found
            if (!$untreatedOrder) {
                return response()->json(['message' => 'No untreated orders found'], 404);
            }

            // Create a new EmployeeCycle entry
            $employeeCycle = new EmployeeCycle();
            $employeeCycle->user_id = $employeeWithMinCycleJob->id;
            $employeeCycle->order_id = $untreatedOrder->id;
            $employeeCycle->save();

            DB::commit();

            return response()->json([
                "message" => "Order assigned successfully",
                "Untreated Orders" => $untreatedOrder,
                "Employee Cycle" => $employeeCycle,
                "Employee With Min CycleJob" => $employeeWithMinCycleJob,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Something went wrong', 'error' => $e->getMessage()], 500);
        }
    }


    public function Handlecycle(Request $request)
    {
        DB::beginTransaction();

        try {
            // Retrieve the employee with the lowest cyclejob
            $employeeWithMinCycleJob = User::where('role', 'employee')
                ->orderBy('count', 'asc')
                ->first();

            // Check if an employee with min cyclejob is found
            if (!$employeeWithMinCycleJob) {
                return response()->json(['message' => 'No employees found'], 404);
            }

            // Retrieve the first untreated order
            $untreatedOrder = Orders::where('status', 'pending')->first();

            // Check if an untreated order is found
            if (!$untreatedOrder) {
                return response()->json(['message' => 'No untreated orders found'], 404);
            }

            $untreatedOrder->status = $request->status;
            $untreatedOrder->save();

            // Create a new EmployeeCycle entry
            $employeeCycle = new EmployeeCycle();
            $employeeCycle->user_id = $employeeWithMinCycleJob->id;
            $employeeCycle->order_id = $untreatedOrder->id;
            $employeeCycle->save();

            // Update the employee's cyclejob count
            $employeeWithMinCycleJob->count++;
            $employeeWithMinCycleJob->save();

            DB::commit();

            return response()->json([
                "message" => "Order assigned successfully",
                "Untreated Orders" => $untreatedOrder,
                "Employee Cycle" => $employeeCycle,
                "Employee With Min CycleJob" => $employeeWithMinCycleJob,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Something went wrong', 'error' => $e->getMessage()], 500);
        }
    }

    public function Logs(Request $request)
{
    try {
        $user = auth()->user();

        // Get the page number from the query parameter, default to 1 if not provided
        $page = $request->query('page', 1);

        // Calculate the offset based on the page number
        $offset = ($page - 1) * 10;

        if ($user->role === 'admin') {
            // Build the base query for auth logs with join to users table
            $authLogsQuery = LogLogins::query()
                ->join('users', 'log_logins.user_id', '=', 'users.id')
                ->select('log_logins.*', 'users.first_name', 'users.last_name');

            // Build the base query for orders logs with join to users table
            $ordersLogsQuery = LogOders::query()
                ->join('users', 'log_oders.user_id', '=', 'users.id')
                ->select('log_oders.*', 'users.first_name', 'users.last_name');

            // Apply filters if present and not empty
            if ($request->filled('first_name')) {
                $authLogsQuery->where('users.first_name', 'like', '%' . $request->input('first_name') . '%');
                $ordersLogsQuery->where('users.first_name', 'like', '%' . $request->input('first_name') . '%');
            }

            if ($request->filled('last_name')) {
                $authLogsQuery->where('users.last_name', 'like', '%' . $request->input('last_name') . '%');
                $ordersLogsQuery->where('users.last_name', 'like', '%' . $request->input('last_name') . '%');
            }

            if ($request->filled('login_action')) {
                $authLogsQuery->where('log_logins.action', 'like', '%' . $request->input('login_action') . '%');
            }

            if ($request->filled('order_action')) {
                $ordersLogsQuery->where('log_oders.action', 'like', '%' . $request->input('order_action') . '%');
            }

            // Get total rows for pagination
            $totalAuthLogsRows = $authLogsQuery->count();
            $totalOrdersLogsRows = $ordersLogsQuery->count();

            // Fetch paginated results
            $authLogs = $authLogsQuery->offset($offset)
                ->limit(10)
                ->get();

            $ordersLogs = $ordersLogsQuery->offset($offset)
                ->limit(10)
                ->get();

            return response()->json([
                'Auth Logs' => $authLogs,
                'Orders Logs' => $ordersLogs,
                'Total Auth Logs Rows' => $totalAuthLogsRows,
                'Total Orders Logs Rows' => $totalOrdersLogsRows
            ]);
        } else {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }
    } catch (Exception $e) {
        return response()->json([
            'message' => 'An error occurred while retrieving data',
            'error' => $e->getMessage(),
        ], 500);
    }
}






    public function Category(Request $request, $id)
    {
        try {
            $user = auth()->user();

            if ($user->role === 'admin' || $user->role === 'employee') {
                // Find the category by ID
                $category = Category::find($id);

                if ($category) {
                    return response()->json([
                        'status' => true,
                        'data' => $category,
                    ]);
                } else {
                    return response()->json([
                        'status' => false,
                        'message' => 'Category not found',
                    ], 404); // 404 Not Found
                }
            } else {
                return response()->json([
                    'message' => 'Unauthorized',
                ], 403); // 403 Forbidden
            }
        } catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while retrieving the category',
                'error' => $e->getMessage(),
            ], 500); // 500 Internal Server Error
        }
    }



    public function Categories(Request $request)
    {
        try {
            $user = auth()->user();

            if ($user->role === 'admin' or $user->role === 'employee') {
                // Get the page number from the query parameter, default to 1 if not provided
                $page = $request->query('page', 1);

                // Calculate the offset based on the page number
                $offset = ($page - 1) * 10;

                // Initialize the base query for employees
                $baseQuery = DB::table('categories');

                if ($request->has('query')) {
                    $searchQuery = $request->input('query');

                    if (strtolower($searchQuery) === 'all' || strtolower($searchQuery) === 'tout') {
                        $baseQuery = $baseQuery->offset($offset)->limit(10);
                    } else {
                        $baseQuery = $baseQuery->where(function ($query) use ($searchQuery) {
                            $query->Where('CategoryName', 'like', '%' . $searchQuery . '%');
                        })->offset($offset)->limit(10);
                    }
                } else {
                    $baseQuery = $baseQuery->offset($offset)->limit(10);
                }

                // Get the total rows for pagination
                $totalRows = $baseQuery->count();

                // Fetch the paginated results
                $employees = $baseQuery->get();

                return response()->json([
                    'data' => $employees,
                    'total_rows' => $totalRows,
                ]);
            } else {
                return response()->json([
                    'message' => 'Unauthorized',
                ], 403);
            }
        } catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while retrieving data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
