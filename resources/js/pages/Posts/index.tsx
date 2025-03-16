import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from '@headlessui/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts',
        href: '/posts', // optional
    },
];
export default function Posts() {
    const { posts } = usePage().props;
    const {delete:ds}=useForm();
    const destroyPost = (e, id) => {
      e.preventDefault();
      if (confirm('Are you sure you want to delete this post?')) {
        ds(route('posts.destroy', id));
      }
  };
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />
            <Link href={route('posts.create')} className="inline-block rounded-md border border-transparent bg-indigo-600 px-3 py-1 text-center  text-white hover:bg-indigo-700">
            Create Post
            </Link>
            <Table className='max-w-11/12 m-5'>
  {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">ID</TableHead>
      <TableHead>Title</TableHead>
      <TableHead>body</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {posts.map(({ id, title, body }) => (
    <TableRow key={id}>
      <TableCell className="font-medium">{id}</TableCell>
      <TableCell>{title}</TableCell>
      <TableCell>{body}</TableCell>
      <TableCell className="text-right">

    {/* <TableRow>
      <TableCell className="font-medium">INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>Credit Card</TableCell>
      <TableCell className="text-right"> */}
     
<div className='flex justify-end gap-1'>
<Link href={route('posts.edit',id)} className="inline-block rounded-md border border-transparent bg-indigo-600 px-3 py-1 text-center  text-white hover:bg-indigo-700">
            Edit
            </Link>
 {/* <Button className="inline-block rounded-md border border-transparent bg-indigo-600 px-3 py-1 text-center  text-white hover:bg-indigo-700">Edit</Button> */}
 <form  onSubmit={(e)=>destroyPost(e,id)}>

      <Button type="submit" className="inline-block rounded-md border border-transparent bg-red-500 px-3 py-1 text-center  text-white hover:bg-red-700">Delete</Button>
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
