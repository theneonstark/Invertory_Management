<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductNameController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SalaryController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\SupportRequestController;
use App\Http\Controllers\UpdateController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::get('/', function () {
    return Inertia::render('Auth/Login');
})->middleware('guest');
Route::post('/login', [AuthController::class, 'login'])->middleware('guest');
Route::post('/store', [AuthController::class, 'store']);
Route::get('/logout', [AuthController::class, 'logout']);
Route::get('/logged-in-user', [AuthController::class, 'getLoggedInUser']);

Route::group(['middleware' => 'auth'], function() {
    
});

Route::get('/admin/dashboard', function(){
    return Inertia::render('Dashboard');
});
Route::get('/admin/category', function(){
    return Inertia::render('Category');
});
Route::get('/admin/productname', function(){
    return Inertia::render('ProductName');
});
Route::get('/admin/branches', function(){
    return Inertia::render('Shop');
});
Route::get('/admin/allproducts', function(){
    return Inertia::render('AllProducts');
});
Route::get('/admin/support-request', function(){
    return Inertia::render('Support');
});

Route::get('/admin/product/{id?}', function( $id = null){
    return Inertia::render('AddProduct', ['id' => $id]);
});
Route::get('/admin/user/{id?}', function( $id = null){
    return Inertia::render('AddUser', ['id' => $id]);
});
Route::get('/admin/allusers', function(){
    return Inertia::render('AllUsers');
});

Route::get('/admin/salary', function(){
    return Inertia::render('AddSalary');
});

Route::get('/admin/ordertracking', function(){
    return Inertia::render('OrderTracking');
});



Route::prefix('shops')->group(function () {
Route::get('/', [ShopController::class, 'index']); // GET /shops
Route::post('/', [ShopController::class, 'store']); // POST /shops
Route::put('/{id}', [ShopController::class, 'update']); // PUT /shops/{id}
Route::delete('/{id}', [ShopController::class, 'destroy']); // DELETE /shops/{id}
});

Route::prefix('categories')->group(function () {
Route::post('/', [CategoryController::class, 'addCategory']); // Add category
Route::get('/', [CategoryController::class, 'getAllCategories']); // Get all categories
Route::get('{id}', [CategoryController::class, 'getCategory']); // Get a category by ID
Route::put('{id}', [CategoryController::class, 'updateCategory']); // Update category
Route::delete('{id}', [CategoryController::class, 'deleteCategory']); // Delete category
});

// Product Name routes
Route::prefix('product-names')->group(function () {
Route::post('/', [ProductNameController::class, 'addProductName']); // Add a product name
Route::get('/', [ProductNameController::class, 'getAllProductNames']); // Get all product names
Route::get('{id}', [ProductNameController::class, 'getProductName']); // Get a product name by ID
Route::put('{id}', [ProductNameController::class, 'updateProductName']); // Update a product name by ID
Route::delete('{id}', [ProductNameController::class, 'deleteProductName']); // Delete a product name by ID
});

Route::prefix('products')->group(function () {
Route::get('/', [ProductController::class, 'getAllProduct']);
Route::post('/add', [ProductController::class, 'addProduct']);
Route::put('/update/{id}', [ProductController::class, 'updateProduct']);
Route::delete('/delete/{id}', [ProductController::class, 'deleteProduct']);
});

Route::prefix('roles')->group(function () {
    Route::post('/create', [RoleController::class, 'store']);
    Route::get('/list', [RoleController::class, 'getAllRoles']);
});

// User Routes
Route::prefix('users')->group(function () {
    Route::post('/register', [UserController::class, 'store']);
    Route::get('/list', [UserController::class, 'getAllUsers']);
    Route::delete('/delete/{id}', [UserController::class, 'deleteUser']);
    Route::put('/update/{id}', [UserController::class, 'updateUser']);
});

Route::prefix('salary')->group(function(){
    Route::get('/salaryData', [SalaryController::class, 'index']);
    Route::post('/addSalary', [SalaryController::class,'add']);
});


Route::prefix('orders')->group(function () {
    Route::get('/list', [OrderController::class, 'getAllOrders']);
    Route::put('/update/{id}', [OrderController::class, 'update']);
});
Route::prefix('support')->group(function () {
    Route::get('/support-requests', [SupportRequestController::class, 'index']);
    Route::put('/support-requests/{id}/status', [SupportRequestController::class, 'updateStatus']);
});

Route::prefix('expenses')->group(function () {
    Route::post('/', [ExpenseController::class, 'store']);
    Route::get('/', [ExpenseController::class, 'index']);
    Route::get('/{id}', [ExpenseController::class, 'show']);
});

