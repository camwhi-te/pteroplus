<?php

namespace Pterodactyl\Http\Controllers\Admin;

use Illuminate\View\View;
use Pterodactyl\Http\Controllers\Controller;
use Pterodactyl\Services\Health\SystemHealthService;

class HealthController extends Controller
{
    /**
     * HealthController constructor.
     */
    public function __construct(private SystemHealthService $healthService)
    {
    }

    /**
     * Return the admin health view.
     */
    public function index(): View
    {
        $data = $this->healthService->handle();

        return view('admin.health', ['data' => $data]);
    }
}
