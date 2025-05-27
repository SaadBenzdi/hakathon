import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@headlessui/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts',
        href: '/posts', // optional
    },
];
export default function Posts() {
    const { posts } = usePage().props;
    const { delete: ds } = useForm();
    const destroyPost = (e, id) => {
        e.preventDefault();
        if (confirm('Are you sure you want to delete this post?')) {
            ds(route('posts.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />
            <Link
                href={route('posts.create')}
                className="inline-block rounded-md border border-transparent bg-green-600 px-3 py-1 text-center text-white hover:bg-green-700"
            >
                Create Post
            </Link>
            <Table className="m-5 max-w-11/12">
                {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Body</TableHead>
                        <TableHead>Photo</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {posts.map(({ id, title, body, photo }) => (
                        <TableRow key={id}>
                            <TableCell className="font-medium">{id}</TableCell>
                            <TableCell>{title}</TableCell>
                            <TableCell>{body}</TableCell>
                            <TableCell>
                                {photo ? (
                                    <img
                                    src={photo}
                                    // src={photo.startsWith('http') ? photo : `/storage/${photo}`}
                                        // src={`/storage/posts/${photo}`} // Assurez-vous que Laravel stocke bien dans public/storage
                                        alt="Post Image"
                                        className="h-16 w-16 rounded-md object-cover"
                                    />
                                ) : (
                                    <span className="text-gray-500">No Image</span>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                    <Link
                                        href={route('posts.edit', id)}
                                        className="inline-block rounded-md border border-transparent bg-indigo-600 px-3 py-1 text-center text-white hover:bg-indigo-700"
                                    >
                                        Edit
                                    </Link>
                                    {/* <Button className="inline-block rounded-md border border-transparent bg-indigo-600 px-3 py-1 text-center  text-white hover:bg-indigo-700">Edit</Button> */}
                                    <form onSubmit={(e) => destroyPost(e, id)}>
                                        <Button
                                            type="submit"
                                            className="inline-block rounded-md border border-transparent bg-red-500 px-3 py-1 text-center text-white hover:bg-red-700"
                                        >
                                            Delete
                                        </Button>
                                    </form>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4"> */}

            {/* <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min"> */}
        </AppLayout>
    );
}
