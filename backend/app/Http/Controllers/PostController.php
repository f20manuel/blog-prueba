<?php

namespace App\Http\Controllers;

use App\Post;
use Illuminate\Http\Request;

use Image;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json([
            'posts' => Post::with('category')->get(),
        ], 200);
    }

    public function getPostsLimit()
    {
        return response()->json([
            'posts' => Post::with('category')->limit(4),
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
    public function store(Request $request)
    {
        try {
            $newPost = Post::create([
                'title' => $request->input('title'),
                'content' => $request->input('content'),
                'category_id' => $request->input('category_id'),
                'slug' => $request->input('slug'),
                'shortDescription' => $request->input('description')
            ]);

            if (!is_null($request->file('image'))) {
                $image = $request->file('image');
                $image_name = $newPost->id . '.' . $image->getClientOriginalExtension();
                $destination_path = public_path("post/100");

                if (!file_exists($destination_path)) {
                    mkdir($destination_path, 0775, true);
                }

                $resize_image = Image::make($image->getRealPath());
                $resize_image->resize(100, 100, function($constrained) {
                    $constrained->aspectRatio();
                })->save($destination_path . '/' . $image_name);

                $destination_path = public_path("post/512");
                if (!file_exists($destination_path)) {
                    mkdir($destination_path, 0775, true);
                }
                $resize_image = Image::make($image->getRealPath());
                $resize_image->resize(512, 512, function($constrained) {
                    $constrained->aspectRatio();
                })->save($destination_path . '/' . $image_name);

                $destination_path = public_path("post/1280");
                if (!file_exists($destination_path)) {
                    mkdir($destination_path, 0775, true);
                }
                $resize_image = Image::make($image->getRealPath());
                $resize_image->resize(1280, 1280, function($constrained) {
                    $constrained->aspectRatio();
                })->save($destination_path . '/' . $image_name);

                $newPost->update([
                    'image' => $image_name,
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
     * @param  \App\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $slug = 'http://localhost:3000/articulos/' . $request->input('slug');
        $post = Post::whereSlug($slug)->with('category');

        return response()->json([
            'post' => $post->first()
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function edit(Post $post)
    {
        return response()->json([
            'post' => $post
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Post $post)
    {
        $post->update([
            'title' => $request->input('title'),
            'category_id' => $request->input('category_id'),
            'slug' => $request->input('slug'),
            'content' => $request->input('content'),
            'shortDescription' => $request->input('shortDescription'),
        ]);

        if ($request->file('image')) {
            unlink("post/100/{$post->image}");
            unlink("post/512/{$post->image}");
            unlink("post/1280/{$post->image}");
            $image = $request->file('image');
            $image_name = $category->name . '.' . $image->getClientOriginalExtension();
            $destination_path = public_path("post/100");

            if (!file_exists($destination_path)) {
                mkdir($destination_path, 0775, true);
            }

            $resize_image = Image::make($image->getRealPath());
            $resize_image->resize(100, 100, function($constrained) {
                $constrained->aspectRatio();
            })->save($destination_path . '/' . $image_name);
            $destination_path = public_path("post/512");

            if (!file_exists($destination_path)) {
                mkdir($destination_path, 0775, true);
            }

            $resize_image = Image::make($image->getRealPath());
            $resize_image->resize(512, 512, function($constrained) {
                $constrained->aspectRatio();
            })->save($destination_path . '/' . $image_name);
            $destination_path = public_path("post/1280");

            if (!file_exists($destination_path)) {
                mkdir($destination_path, 0775, true);
            }

            $resize_image = Image::make($image->getRealPath());
            $resize_image->resize(1280, 1280, function($constrained) {
                $constrained->aspectRatio();
            })->save($destination_path . '/' . $image_name);

            $post->update([
                'image' => $image_name,
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function destroy(Post $post)
    {
        $post->delete();
        unlink("post/100/{$post->image}");
        unlink("post/512/{$post->image}");
        unlink("post/1280/{$post->image}");
    }
}
