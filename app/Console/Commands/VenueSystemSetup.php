<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class VenueSystemSetup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'venue:setup {--fresh : Refresh the database with fresh migrations}'
                           . ' {--seed : Seed the database with test data}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Set up the venue reservation system';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Setting up the venue reservation system...');
        
        // Run migrations
        if ($this->option('fresh')) {
            $this->info('Refreshing database migrations...');
            Artisan::call('migrate:fresh', ['--force' => true]);
            $this->info('Database refreshed successfully.');
        } else {
            $this->info('Running migrations...');
            Artisan::call('migrate', ['--force' => true]);
            $this->info('Migrations completed successfully.');
        }
        
        // Seed the database if requested
        if ($this->option('seed')) {
            $this->info('Seeding the database with test data...');
            Artisan::call('db:seed', ['--force' => true]);
            $this->info('Database seeded successfully.');
        }
        
        // Clear caches
        $this->info('Clearing caches...');
        Artisan::call('cache:clear');
        Artisan::call('config:clear');
        Artisan::call('route:clear');
        Artisan::call('view:clear');
        $this->info('All caches cleared successfully.');
        
        // Final message
        $this->info('\nSetup completed successfully!');
        $this->info('You can now access your venue reservation system at: /dashboard');
        $this->info('Default admin credentials:');
        $this->info('   Email: admin@venuebook.ma');
        $this->info('   Password: password');
        
        return Command::SUCCESS;
    }
}
