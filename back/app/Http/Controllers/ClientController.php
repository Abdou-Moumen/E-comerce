<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Client;
use App\Models\Discount;
use App\Models\EmployeeCycle;
use App\Models\Orders;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductOrder;
use App\Models\Quantity;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;

class ClientController extends Controller
{

    public function create(Request $request)
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


    // OrderList

    public function orderListClient(Request $request)
    {
        try {
            // Get the page number from the query parameter, default to 1 if not provided
            $page = $request->query('page', 1);

            // Calculate the offset based on the page number
            $offset = ($page - 1) * 10;

            // Initialize the base query for orders
            $baseQuery = DB::table('orders')
                ->join('clients', 'orders.client_id', '=', 'clients.id')
                ->join('addresses', 'clients.addresse_id', '=', 'addresses.id')
                ->select('orders.*', 'clients.first_name', 'clients.last_name', 'addresses.wilaya')
                ->offset($offset)
                ->limit(10);

            if ($request->has('query')) {
                $searchQuery = $request->input('query');

                if (strtolower($searchQuery) === 'all' || strtolower($searchQuery) === 'tout') {
                    // No additional filtering needed
                } else {
                    $baseQuery = $baseQuery->where(function ($query) use ($searchQuery) {
                        $query->where('orders.status', 'like', '%' . $searchQuery . '%')
                            ->orWhere('addresses.wilaya', 'like', '%' . $searchQuery . '%')
                            ->orWhere('orders.isDeleted', 'like', '%' . $searchQuery . '%');
                    });
                }
            }

            // Get the total rows for pagination
            $totalRows = $baseQuery->count();

            // Fetch the paginated results
            $orders = $baseQuery->get();

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


    // order for client


    public function orderCilent($id)
    {
        // Join tables and select the required fields
        $order = DB::table('product_orders')
            ->join('orders', 'product_orders.order_id', '=', 'orders.id')
            ->join('clients', 'orders.client_id', '=', 'clients.id')
            ->join('addresses', 'clients.addresse_id', '=', 'addresses.id')
            ->join('products', 'product_orders.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->join('quantities', 'product_orders.quantity_id', '=', 'quantities.id')
            ->join('product_colors', 'quantities.product_color_id', '=', 'product_colors.id')
            ->join('sizes', 'quantities.size_id', '=', 'sizes.id')
            ->select(
                'orders.*',
                'clients.first_name',
                'clients.last_name',
                'clients.phone_1',
                'clients.phone_2',
                'addresses.wilaya',
                'addresses.common',
                'addresses.adress',
                'product_orders.totalPrice as totalPriceOrderProduct',
                'products.product_name',
                'products.description',
                'products.price as product_price',
                'categories.CategoryName',
                'quantities.quantity',
                'product_colors.color_name',
                'sizes.size'
            )
            ->where('orders.id', $id)
            ->get();

        return response()->json($order);
    }


    public function DiscountsClient(Request $request)
    {
        try {
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
        } catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while retrieving data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function DiscountClient($id)
    {

        $dicount = Discount::find($id);

        return response()->json($dicount);
    }


    public function ColorsAndSizesClient(Request $request)
    {
        try {
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
        } catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while retrieving data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function ProductsClient(Request $request)
    {
        try {
            // Get the page number from the query parameter, default to 1 if not provided
            $page = $request->query('page', 1);

            // Calculate the offset based on the page number
            $offset = ($page - 1) * 10;

            // Initialize the base query for products with joins
            $baseQuery = DB::table('products')
                ->join('categories', 'products.category_id', '=', 'categories.id')
                // ->join('quantities', 'products.id', '=', 'quantities.product_id')
                // ->join('sizes', 'quantities.size_id', '=', 'sizes.id')
                // ->join('product_colors', 'quantities.product_color_id', '=', 'product_colors.id')
                // Use left join to include products without discounts
                ->leftJoin('discounts', 'products.id', '=', 'discounts.product_id')
                ->select(
                    'products.*',
                    'categories.CategoryName',
                    // 'quantities.quantity',
                    // 'sizes.size',
                    // 'product_colors.color_name',
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
        } catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while retrieving data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function ProductClient($productId)
{
    try {

            // Fetch the product details with joins and ensure distinct results
            $product = Product::where('products.id', $productId)
                ->join('categories', 'products.category_id', '=', 'categories.id')
                ->join('quantities', 'products.id', '=', 'quantities.product_id')
                ->join('sizes', 'quantities.size_id', '=', 'sizes.id')
                ->join('product_colors', 'quantities.product_color_id', '=', 'product_colors.id')
                ->select(
                    'products.id as product_id', // Alias to avoid ambiguity
                    'products.category_id',
                    'products.product_name',
                    'products.description',
                    'products.price',
                    'products.Totalquantity',
                    'products.is_discounted',
                    'products.created_at',
                    'products.updated_at',
                    'categories.CategoryName',
                    'quantities.quantity as available_quantity',
                    'sizes.size',
                    'sizes.id as size_id',
                    'product_colors.color_name',
                    'product_colors.id as color_id'
                )
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

                // Calculate discount_percentage
                if ($product->discount_amount && $product->price > 0) {
                    $product->discount_percentage = ($product->discount_amount / $product->price) * 100;
                } else {
                    $product->discount_percentage = 0;
                }
            } else {
                $product->discount_amount = 0;
                $product->discount_percentage = 0;
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
            $imageUrls = $productImages->map(function ($image) {
                return asset('storage/' . $image->image);
            });

            // Add image_urls to the product object
            $product->image_urls = $imageUrls;

            // Add formatted quantities to the product object
            $product->quantities = $formattedQuantities;

            return response()->json([
                'data' => $product,
            ]);
    } catch (Exception $e) {
        return response()->json([
            'message' => 'An error occurred while retrieving data',
            'error' => $e->getMessage(),
        ], 500);
    }
}




    public function GetProductLandingPageClient(Request $request)
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
            if ($joinDiscounts == true) {
                $baseQuery = $baseQuery
                    ->join('discounts', 'products.id', '=', 'discounts.product_id')
                    ->addSelect('discounts.amount', 'discounts.duration');
            }

            // Get the total rows for pagination
            $totalRows = DB::table('products')->count();

            // Fetch the paginated results
            $products = $baseQuery->get();

            // Fetch product images for each product and ensure only main images are included
            $productsWithImages = $products->map(function ($product) {
                $productImages = ProductImage::where('product_id', $product->id)
                    ->where('is_main', true)
                    ->get();

                $imageUrls = $productImages->map(function ($image) {
                    return asset('storage/' . $image->image);
                });

                // Add image_urls to the product object
                $product->image_urls = $imageUrls;

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
}
