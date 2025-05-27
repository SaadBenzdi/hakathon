import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: '/settings/appearance',
    },
];

export default function Appearance() {
    const { auth } = usePage<SharedData>().props;
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light'); // Default white theme
    
    useEffect(() => {
        // Get saved theme preference
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            // Set default theme to light/white
            localStorage.setItem('theme', 'light');
        }
    }, []);
    
    const applyTheme = (selectedTheme: 'light' | 'dark' | 'system') => {
        setTheme(selectedTheme);
        localStorage.setItem('theme', selectedTheme);
        
        // Apply theme to document
        if (selectedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else if (selectedTheme === 'light') {
            document.documentElement.classList.remove('dark');
        } else if (selectedTheme === 'system') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            systemPrefersDark
                ? document.documentElement.classList.add('dark')
                : document.documentElement.classList.remove('dark');
        }
    };
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Appearance settings" description="Update your account's appearance settings" />
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Thème</CardTitle>
                            <CardDescription>
                                Personnalisez l'apparence de l'interface utilisateur
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup
                                value={theme}
                                onValueChange={(value) => applyTheme(value as 'light' | 'dark' | 'system')}
                                className="grid grid-cols-3 gap-4"
                            >
                                <div>
                                    <RadioGroupItem
                                        value="light"
                                        id="theme-light"
                                        className="sr-only"
                                    />
                                    <Label
                                        htmlFor="theme-light"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                                    >
                                        <div className="mb-3 rounded-md border border-muted p-1">
                                            <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                                                <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                                                    <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                                                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                                                </div>
                                                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                                                    <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                                                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                                                </div>
                                                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                                                    <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                                                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                                                </div>
                                            </div>
                                        </div>
                                        <span className="block w-full p-2 text-center font-normal">
                                            Clair (Défaut)
                                        </span>
                                    </Label>
                                </div>
                                
                                <div>
                                    <RadioGroupItem
                                        value="dark"
                                        id="theme-dark"
                                        className="sr-only"
                                    />
                                    <Label
                                        htmlFor="theme-dark"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                                    >
                                        <div className="mb-3 rounded-md border border-muted p-1">
                                            <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                                                <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                                    <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                                                    <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                                                </div>
                                                <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                                    <div className="h-4 w-4 rounded-full bg-slate-400" />
                                                    <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                                                </div>
                                                <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                                    <div className="h-4 w-4 rounded-full bg-slate-400" />
                                                    <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                                                </div>
                                            </div>
                                        </div>
                                        <span className="block w-full p-2 text-center font-normal">
                                            Sombre
                                        </span>
                                    </Label>
                                </div>
                                
                                <div>
                                    <RadioGroupItem
                                        value="system"
                                        id="theme-system"
                                        className="sr-only"
                                    />
                                    <Label
                                        htmlFor="theme-system"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                                    >
                                        <div className="mb-3 rounded-md border border-muted p-1">
                                            <div className="space-y-2 rounded-sm bg-gradient-to-r from-[#ecedef] to-slate-950 p-2">
                                                <div className="space-y-2 rounded-md bg-gradient-to-r from-white to-slate-800 p-2 shadow-sm">
                                                    <div className="h-2 w-[80px] rounded-lg bg-gradient-to-r from-[#ecedef] to-slate-400" />
                                                    <div className="h-2 w-[100px] rounded-lg bg-gradient-to-r from-[#ecedef] to-slate-400" />
                                                </div>
                                                <div className="flex items-center space-x-2 rounded-md bg-gradient-to-r from-white to-slate-800 p-2 shadow-sm">
                                                    <div className="h-4 w-4 rounded-full bg-gradient-to-r from-[#ecedef] to-slate-400" />
                                                    <div className="h-2 w-[100px] rounded-lg bg-gradient-to-r from-[#ecedef] to-slate-400" />
                                                </div>
                                                <div className="flex items-center space-x-2 rounded-md bg-gradient-to-r from-white to-slate-800 p-2 shadow-sm">
                                                    <div className="h-4 w-4 rounded-full bg-gradient-to-r from-[#ecedef] to-slate-400" />
                                                    <div className="h-2 w-[100px] rounded-lg bg-gradient-to-r from-[#ecedef] to-slate-400" />
                                                </div>
                                            </div>
                                        </div>
                                        <span className="block w-full p-2 text-center font-normal">
                                            Système
                                        </span>
                                    </Label>
                                </div>
                            </RadioGroup>
                            
                            <div className="mt-6">
                                <p className="text-sm text-muted-foreground">
                                    Le thème clair est le thème par défaut de l'application.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
