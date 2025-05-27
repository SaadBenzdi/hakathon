<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() //This method will return all the posts from the database.
    {
        return Inertia::render('Posts/index', [
            //photos
            // 'posts' => Post::latest()->get()->map(function ($post) {
            //     return [
            //         'id' => $post->id,
            //         'title' => $post->title,
            //         'body' => $post->body,
            //         'photo' => $post->photo ? asset('storage/' . $post->photo) : null,
            //         'created_at' => $post->created_at->diffForHumans(),
            //     ];
            // }),

            'posts' => Post::latest()->get()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() //This method will return the view to create a new post.
    {
        return Inertia::render('Posts/create', []);
        // die();// how can show data submited by form
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) //This method will store the new post in the database.
    {
        $request->validate([
            'title' => 'required',
            'body' => 'required',
            'photo' => 'nullable|image|max:2048', // Validation
        ]);

        // Sauvegarde de l'image
        // $photoPath = $request->file('photo')
        //     ? $request->file('photo')->store('posts', 'public')
        //     : null;
        // $photoPath = $request->file('photo')->store('public/posts');
        // $photoPath = str_replace('public/', 'storage/', $photoPath);

        // // Création du post
        // Post::create([
        //     'title' => $request->title,
        //     'body' => $request->body,
        //     'photo' => $photoPath,
        // ]);
        $data = $request->only(['title', 'body']);
    
        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $filename = time() . '_' . $file->getClientOriginalName();
            // Store the file in the "public/uploads" directory
            $path = $file->storeAs('uploads', $filename, 'public');
            $data['photo'] = '/storage/' . $path;
        }
    
        Post::create($data);

        // Post::create($request->all());
        return redirect()->route('posts.index')->with('success', 'Post ajouté avec succès !');
        // dd($request->all());
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id) //This method will return a single post from the database.
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id) //This method will return the view to edit a post.
    {
        return Inertia::render('Posts/edit', [
            'post' => Post::find($id)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'title' => 'required',
            'body' => 'required',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
    
        $post = Post::findOrFail($id);
    
        // Collect data (title & body)
        $data = $request->only(['title', 'body']);
    
        // Handle file upload
        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($post->photo) {
                Storage::disk('public')->delete($post->photo);
            }
    
            // Store new photo
            $file = $request->file('photo');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('uploads', $filename, 'public'); // Save in 'storage/app/public/posts/'
    
            // Save new photo path
            $data['photo'] = $path; // No need to prepend "/storage/", Laravel does it automatically
        }
    
        // Update post
        $post->update($data);
    
        return redirect()->route('posts.index')->with('success', 'Post updated successfully!');
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id) //This method will delete the post from the database.
    {
        $post = Post::findOrFail($id);
        if ($post->photo) {
            Storage::disk('public')->delete($post->photo);
        }
        Post::destroy($id);
        return redirect()->route('posts.index');
    }
}
