<?php

namespace Pterodactyl\Services\Admin;

use Pterodactyl\Models;

class ResourceCounterService
{
    /**
     * Count all available resources linked to the Panel.
     */
    public function handle(): array
    {
        $values = [
            'databases' => Models\DatabaseHost::query()->count(),
            'nodes' => Models\Node::query()->count(),
            'servers' => Models\Server::query()->count(),
            'users' => Models\User::query()->count(),
            'nests' => Models\Nest::query()->count(),
        ];

        return $values;
    }
}
