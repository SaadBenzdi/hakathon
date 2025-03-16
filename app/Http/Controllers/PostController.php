<?php
namespace App\Http\Controllers;

use App\Models\Post;
use Inertia\Inertia;

use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()//This method will return all the posts from the database.
    {
        return Inertia::render('Posts/index', [
            'posts' => Post::latest()->get()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()//This method will return the view to create a new post.
    {
        return Inertia::render('Posts/create', []);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)//This method will store the new post in the database.
    {
        $request->validate([
            'title' => 'required',
            'body' => 'required',
        ]);
        Post::create($request->all());
        return redirect()->route('posts.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)//This method will return a single post from the database.
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)//This method will return the view to edit a post.
    {
        return Inertia::render('Posts/edit', [
            'post' => Post::find($id)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)//This method will update the post in the database.
    {
        $request->validate([
            'title' => 'required',
            'body' => 'required',
        ]);
        Post::find($id)->update($request->all());
        return redirect()->route('posts.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)//This method will delete the post from the database.
    {
        Post::destroy($id);
        return redirect()->route('posts.index');
    }
}
