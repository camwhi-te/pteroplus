<?php

namespace Pterodactyl\Services\Health;

use Illuminate\Support\Facades\Artisan;
use Spatie\Health\ResultStores\ResultStore;
use Spatie\Health\Commands\RunHealthChecksCommand;
use Pterodactyl\Services\Helpers\SoftwareVersionService;

class SystemHealthService
{
    /**
     * SystemHealthService constructor.
     */
    public function __construct(private ResultStore $resultStore, private SoftwareVersionService $version)
    {
    }

    /**
     * Returns an array of data regarding system health.
     */
    public function handle(): array
    {
        Artisan::call(RunHealthChecksCommand::class);

        $results = $this->resultStore->latestResults()->storedCheckResults->toArray();

        $data = [
            'disk' => $results[0]->meta['disk_space_used_percentage'],
            'database' => $results[1]->status === 'ok' ? true : false,
            'cpu' => $results[2]->meta['last_minute'] * 100,
            'is_production' => $results[3]->meta['actual'] !== 'production' ? false : true,
            'recaptcha' => config('recaptcha.enabled', false),
            'optimized' =>  $results[4]->status === 'failed' ? false : true,
            'is_updated' => $this->version->isLatestPanel(),
        ];

        return $data;
    }   
}
