<?php

namespace App\Http\Controllers;

use App\Category;
use Illuminate\Http\Request;
use App\Http\Requests\CreateCategoryRequest;
use Image;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $category = Category::all();
        return response()->json([
            'categories' => $category,
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateCategoryRequest $request)
    {
        try {
            $newCategory = Category::create([
                'name' => $request->input('name'),
                'slug' => $request->input('slug'),
                'description' => $request->input('description')
            ]);

            if (!is_null($request->file('image'))) {
                $image = $request->file('image');
                $image_name = $newCategory->name . '.' . $image->getClientOriginalExtension();
                $destination_path = public_path("category/100");

                if (!file_exists($destination_path)) {
                    mkdir($destination_path, 0775, true);
                }

                $resize_image = Image::make($image->getRealPath());
                $resize_image->resize(100, 100, function($constrained) {
                    $constrained->aspectRatio();
                })->save($destination_path . '/' . $image_name);

                $destination_path = public_path("category/150");
                if (!file_exists($destination_path)) {
                    mkdir($destination_path, 0775, true);
                }
                $resize_image = Image::make($image->getRealPath());
                $resize_image->resize(512, 512, function($constrained) {
                    $constrained->aspectRatio();
                })->save($destination_path . '/' . $image_name);

                $destination_path = public_path("category/1280");
                if (!file_exists($destination_path)) {
                    mkdir($destination_path, 0775, true);
                }
                $resize_image = Image::make($image->getRealPath());
                $resize_image->resize(1024, 1024, function($constrained) {
                    $constrained->aspectRatio();
                })->save($destination_path . '/' . $image_name);

                $newCategory->update([
                    'imagen' => $image_name,
                ]);
            }
            
            return response()->json(['message' => 'success'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function edit(Category $category)
    {
        try {
            return response()->json([
                'category' => $category
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 401);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Category $category)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function destroy(Category $category)
    {
        $category->delete();
        unlink("category/100/{$category->imagen}");
        unlink("category/150/{$category->imagen}");
        unlink("category/1280/{$category->imagen}");
    }
}
