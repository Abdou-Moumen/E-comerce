<?php

use App\Events\testEvent;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\testEventController;
use App\Http\Controllers\Auth\AdminLoginController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\EmployeeLoginController;
use App\Http\Controllers\AuthenteficationController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ImageController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
// Route::view('/notifications', 'notification')->name('notifications');

// Client
Route::post('create', [ClientController::class, 'create']);


// Appear the orders for client
Route::get('orderListClient', [ClientController::class, 'orderListClient']);
Route::get('orderCilent/{id}', [ClientController::class, 'orderCilent']);

// Get Discounts for client
Route::get('DiscountsClient', [ClientController::class, 'DiscountsClient']);
Route::get('DiscountClient/{id}', [ClientController::class, 'DiscountClient']);

// Appear the colors for client
Route::get('ColorsAndSizesClient', [ClientController::class, 'ColorsAndSizesClient']);

// Get Products for client
Route::get('ProductsClient', [ClientController::class, 'ProductsClient']);
Route::get('ProductClient/{productId}', [ClientController::class, 'ProductClient']);

// Landing page for client
Route::get('GetProductLandingPageClient', [ClientController::class, 'GetProductLandingPageClient']);



// Authentification
Route::post('register', [AuthenteficationController::class, 'register']);
Route::post('login', [AdminLoginController::class, 'login']);

Route::get('GetProductLandingPage', [AdminController::class, 'GetProductLandingPage']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('Logs', [AdminController::class, 'Logs']);

    // CRUD Product
    Route::post('CreateProduct', [AdminController::class, 'CreateProduct']);
    Route::post('updateProduct', [AdminController::class, 'updateProduct']);
    Route::delete('deleteProduct/{id}', [AdminController::class, 'deleteProduct']);

    // Get images
    Route::get('GetProductImages/{productId}/', [AdminController::class, 'GetProductImages']);


    // CRUD Category
    Route::post('CreateCategory', [AdminController::class, 'CreateCategory']);
    Route::patch('updateCategory', [AdminController::class, 'updateCategory']);
    Route::delete('deleteCategory/{id}', [AdminController::class, 'deleteCategory']);
    Route::get('Categories', [AdminController::class, 'Categories']);
    Route::get('Category/{id}', [AdminController::class, 'Category']);

    // Add pics
    Route::post('upload-image', [ImageController::class, 'uploadImage']);

    // CRUD client order
    Route::post('CreateClientOrder', [AdminController::class, 'CreateClientOrder']);
    Route::patch('UpdateClientOrder', [AdminController::class, 'UpdateClientOrder']);
    Route::delete('DeleteClientOrder/{id}', [AdminController::class, 'DeleteClientOrder']);

    // Add selledItems
    Route::post('selledItems', [AdminController::class, 'selledItems']);

    // CRUD Promotion
    Route::post('createDiscount', [AdminController::class, 'createDiscount']);
    Route::patch('DiscountUpdate', [AdminController::class, 'DiscountUpdate']);
    Route::delete('deleteDiscount/{id}', [AdminController::class, 'deleteDiscount']);

    // Appear the orders
    Route::get('orderList', [AdminController::class, 'orderList']);
    Route::get('order/{id}', [AdminController::class, 'order']);

    // Get Discounts
    Route::get('Discounts', [AdminController::class, 'Discounts']);
    Route::get('Discount/{id}', [AdminController::class, 'Discount']);

    // Appear the colors
    Route::get('ColorsAndSizes', [AdminController::class, 'ColorsAndSizes']);

    // Get Products
    Route::get('Products', [AdminController::class, 'Products']);
    Route::get('Product/{productId}', [AdminController::class, 'Product']);

   

    // Get the user
    Route::get('user', [AdminController::class, 'user']);

    // CRUD Employee
    Route::post('createEmployee', [EmployeeController::class, 'createEmployee']);
    Route::patch('EmployeesUpdate', [EmployeeController::class, 'EmployeesUpdate']);
    Route::delete('deleteEmployee/{id}', [EmployeeController::class, 'deleteEmployee']);

    // Get Employee
    Route::get('Employees', [EmployeeController::class, 'Employees']);
    Route::get('Employee/{id}', [EmployeeController::class, 'Employee']);
    Route::get('DeletedEmployees', [EmployeeController::class, 'DeletedEmployees']);
    Route::get('DeletedEmployee/{id}', [EmployeeController::class, 'DeletedEmployee']);


    // CRUD Cart
    Route::post('CartAdd', [CartController::class, 'CartAdd']);
    Route::delete('CartRemove/{id}', [CartController::class, 'CartRemove']);
    Route::patch('CartUpdate', [CartController::class, 'CartUpdate']);
    Route::get('Cart/{clientId}', [CartController::class, 'viewCart']);
    Route::get('Carts', [CartController::class, 'Carts']);


    // Statistics
    Route::get('getOrderStatistics', [AdminController::class, 'getOrderStatistics']);

    // cycle
    Route::post('Handlecycle', [AdminController::class, 'Handlecycle']);
    Route::get('cycle', [AdminController::class, 'cycle']);

    // logout
    Route::post('logout', [AdminLoginController::class, 'logout']);
});
