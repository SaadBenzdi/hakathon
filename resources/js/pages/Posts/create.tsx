import { type BreadcrumbItem, type SharedData } from '@/types';
import { Textarea, Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'New Post',
        href: 'posts',
    },
];


export default function Newcreate() {
    const {data, setData, post ,errors}=useForm(
        {
            title:'',
            body:''
        }
    );
    const submit: FormEventHandler = (e) => {e.preventDefault();
        post(route('posts.store'));
    };
  return (
    <>
    <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Profile settings" />
                <div className='p-4'>

                
                <Link href={route('posts.index')} className="w-min rounded-md border border-transparent bg-indigo-600 px-3 py-1 text-center  text-white hover:bg-indigo-700">
                Back
                </Link>
                <form onSubmit={submit} className="space-y-6 pt-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Title</Label>
                                <Input
                                    id="title"
                                    className="mt-1 block w-full"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    
                                    autoComplete="title"
                                    placeholder="title"
                                />
                                <InputError className="mt-2" message={errors.title} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="body">Body</Label>
                                <Textarea
                                    id="body"
                                    className="border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                    value={data.body}
                                    onChange={(e) => setData('body', e.target.value)}
                               
                                    autoComplete="body"
                                    placeholder="Body"
                                />
                                <InputError className="mt-2" message={errors.body} />
                            </div>
                            <Button>Save</Button>
                </form>
                </div>
            </AppLayout>


    </>
  );
}

