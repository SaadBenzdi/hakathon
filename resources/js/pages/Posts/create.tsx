import { type BreadcrumbItem } from '@/types';
import { Textarea } from '@headlessui/react';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { LoaderCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'New Post',
        href: 'posts',
    },
];

export default function Newcreate() {
    const { data, setData, post, errors, processing } = useForm({
        title: '',
        body: '',
        photo: null as File | null,
    });
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('body', data.body);
        if (data.photo) {
            formData.append('photo', data.photo); // Obligatoire pour envoyer une image
        }
        post(route('posts.store'), {
            data: formData,
            forceFormData: true
        });
    };
    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Profile settings" />
                <div className="p-4">
                    <Link
                        href={route('posts.index')}
                        className="w-min rounded-md border border-transparent bg-indigo-600 px-3 py-1 text-center text-white hover:bg-indigo-700"
                    >
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
                            <Label htmlFor="photo">Photo</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                className="mt-1 w-1/3"
                                onChange={(e) => setData('photo', e.target.files?.[0] || null)}
                            />
                            {data.photo && (
                                <img
                                    src={URL.createObjectURL(data.photo)}
                                    alt="Preview"
                                    className="mt-2 h-20 w-20 rounded-lg border-2 object-cover"
                                />
                            )}
                            <InputError className="mt-2" message={errors.photo} />
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
                        <Button type="submit" disabled={processing}>
                            {processing ? (
                                <>
                                    Saving... <LoaderCircle className="h-4 w-4 animate-spin" />
                                </>
                            ) : (
                                'Save'
                            )}
    
                                                 
                        </Button>
                            {/* <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                                Log in
                            </Button> */}
                    </form>
                </div>
            </AppLayout>
        </>
    );
}
