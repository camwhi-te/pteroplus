<?php

namespace Pterodactyl\Http\ViewComposers;

use Illuminate\View\View;
use Pterodactyl\Services\Helpers\AssetHashService;
use Pterodactyl\Services\Admin\ResourceCounterService;

class AssetComposer
{
    private array $count;

    /**
     * AssetComposer constructor.
     */
    public function __construct(
        private AssetHashService $assetHashService,
        private ResourceCounterService $resourceCounterService
    )
    {
        $this->count = $this->resourceCounterService->handle();
    }

    /**
     * Provide access to the asset service in the views.
     */
    public function compose(View $view): void
    {
        $view->with('asset', $this->assetHashService);
        $view->with('siteConfiguration', [
            'name' => config('app.name') ?? 'Pterodactyl',
            'locale' => config('app.locale') ?? 'en',
            'recaptcha' => [
                'enabled' => config('recaptcha.enabled', false),
                'siteKey' => config('recaptcha.website_key') ?? '',
            ],
        ]);
        $view->with('adminContent', [
            'count' => [
                'databases' => $this->count['databases'],
                'nodes' => $this->count['nodes'],
                'servers' => $this->count['servers'],
                'users' => $this->count['users'],
                'nests' => $this->count['nests'],
            ],
        ]);
    }
}
