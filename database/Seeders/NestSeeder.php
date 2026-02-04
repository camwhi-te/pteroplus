<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Pterodactyl\Services\Nests\NestCreationService;
use Pterodactyl\Contracts\Repository\NestRepositoryInterface;

class NestSeeder extends Seeder
{
    /**
     * @var NestCreationService
     */
    private $creationService;

    /**
     * @var NestRepositoryInterface
     */
    private $repository;

    /**
     * NestSeeder constructor.
     */
    public function __construct(
        NestCreationService $creationService,
        NestRepositoryInterface $repository,
    ) {
        $this->creationService = $creationService;
        $this->repository = $repository;
    }

    /**
     * Run the seeder to add missing nests to the Panel.
     *
     * @throws \Pterodactyl\Exceptions\Model\DataValidationException
     */
    public function run()
    {
        $items = $this->repository->findWhere([
            'author' => 'support@pterodactyl.io',
        ])->keyBy('name')->toArray();

        $this->createMinecraftNest(array_get($items, 'Minecraft'));
        $this->createAppsNest(array_get($items, 'Apps'));
        $this->createGamesNest(array_get($items, 'Games'));
    }

    /**
     * Create the Minecraft nest to be used later on.
     *
     * @throws \Pterodactyl\Exceptions\Model\DataValidationException
     */
    private function createMinecraftNest(?array $nest = null)
    {
        if (is_null($nest)) {
            $this->creationService->handle([
                'name' => 'Minecraft',
                'description' => 'Multiple different variants of Minecraft server options.',
            ], 'support@pterodactyl.io');
        }
    }

    /**
     * Create the Games nest to be used later on.
     *
     * @throws \Pterodactyl\Exceptions\Model\DataValidationException
     */
    private function createGamesNest(?array $nest = null)
    {
        if (is_null($nest)) {
            $this->creationService->handle([
                'name' => 'Games',
                'description' => 'Includes several popular game server options.',
            ], 'support@pterodactyl.io');
        }
    }

    /**
     * Create the Apps nest to be used later on.
     *
     * @throws \Pterodactyl\Exceptions\Model\DataValidationException
     */
    private function createAppsNest(?array $nest = null)
    {
        if (is_null($nest)) {
            $this->creationService->handle([
                'name' => 'Apps',
                'description' => 'Useful applications to run via PteroPlus.',
            ], 'support@pterodactyl.io');
        }
    }
}
