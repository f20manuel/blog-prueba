<?php

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

Route::post('login', 'UserController@login');
Route::post('register', 'UserController@register');

Route::get('/unauthorized', 'UserController@unauthorized');
Route::group(['middleware' => ['cors', 'CheckClientCredentials','auth:api']], function() {
    Route::post('logout', 'UserController@logout');
    Route::post('details', 'UserController@details');

    Route::prefix('categories')->group(function () {
        Route::get('/', 'CategoryController@index');
        Route::post('/', 'CategoryController@store');
        Route::get('/{category}/edit', 'CategoryController@edit');
        Route::delete('/{category}', 'CategoryController@destroy');
    });

    Route::prefix('posts')->group(function () {
        Route::get('/', 'PostController@index');
        Route::post('/', 'PostController@store');
        Route::get('/{post}/edit', 'PostController@edit');
        Route::delete('/{post}', 'PostController@destroy');
    });
});