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

Route::get('/posts', 'PostController@index');

Route::get('/unauthorized', 'UserController@unauthorized');
Route::group(['middleware' => ['cors', 'CheckClientCredentials','auth:api']], function() {
    Route::post('logout', 'UserController@logout');
    Route::post('details', 'UserController@details');

    Route::prefix('users')->group(function () {
        Route::get('/', 'UserController@index');
        Route::get('/{user}/edit', 'UserController@edit');
        Route::patch('/{user}', 'UserController@update');
        Route::delete('/{user}', 'UserController@destroy');
    });

    Route::prefix('categories')->group(function () {
        Route::get('/', 'CategoryController@index');
        Route::post('/', 'CategoryController@store');
        Route::get('/{category}/edit', 'CategoryController@edit');
        Route::patch('/{category}', 'CategoryController@update');
        Route::delete('/{category}', 'CategoryController@destroy');
    });

    Route::prefix('posts')->group(function () {
        Route::post('/', 'PostController@store');
        Route::get('/{post}/edit', 'PostController@edit');
        Route::post('/show', 'PostController@show');
        Route::patch('/{post}', 'PostController@update');
        Route::delete('/{post}', 'PostController@destroy');
    });
});