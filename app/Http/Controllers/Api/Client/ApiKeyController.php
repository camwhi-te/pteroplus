<?php

namespace Pterodactyl\Http\Controllers\Api\Client;

use Pterodactyl\Models\ApiKey;
use Illuminate\Http\JsonResponse;
use Pterodactyl\Facades\Activity;
use Pterodactyl\Services\Acl\Api\AdminAcl;
use Pterodactyl\Exceptions\DisplayException;
use Pterodactyl\Services\Api\KeyCreationService;
use Pterodactyl\Http\Requests\Api\Client\ClientApiRequest;
use Pterodactyl\Transformers\Api\Client\ApiKeyTransformer;
use Pterodactyl\Http\Requests\Api\Client\Account\StoreApiKeyRequest;

class ApiKeyController extends ClientApiController
{
    public function __construct(private KeyCreationService $keyCreationService)
    {
        parent::__construct();
    }

    /**
     * Returns all the API keys that exist for the given client.
     */
    public function index(ClientApiRequest $request): array
    {
        return $this->fractal->collection($request->user()->apiKeys)
            ->transformWith($this->getTransformer(ApiKeyTransformer::class))
            ->toArray();
    }

    /**
     * Store a new API key for a user's account.
     *
     * @throws DisplayException
     */
    public function store(StoreApiKeyRequest $request): array
    {
        if ($request->user()->apiKeys->count() >= 25) {
            throw new DisplayException('You have reached the account limit for number of API keys.');
        }
        
        $token = $request->user()->createToken(
            $request->input('description'),
            $request->input('allowed_ips'),
        );

        Activity::event('user:api-key.create')
            ->subject($token->accessToken)
            ->property('identifier', $token->accessToken->identifier)
            ->log();

        return $this->fractal->item($token->accessToken)
            ->transformWith($this->getTransformer(ApiKeyTransformer::class))
            ->addMeta(['secret_token' => $token->plainTextToken])
            ->toArray();
    }

    /**
     * Store a new API key for a user's account with type application.
     *
     * @throws DisplayException
     */
    public function storeApplication(StoreApiKeyRequest $request): array
    {
         $key = $this->keyCreationService->setKeyType(ApiKey::TYPE_APPLICATION)->handle([   
            'memo' => $request->input('description'),
            'user_id' => $request->user()->id,
        ], $request->getKeyPermissions());

        Activity::event('user:api-key.create')
            ->subject($key)
            ->property('identifier', $key->identifier)
            ->log();

        return $this->fractal->item($key)
            ->transformWith($this->getTransformer(ApiKeyTransformer::class))
            ->addMeta(['secret_token' => $key->identifier . decrypt($key->token)])
            ->toArray();
    }


    /**
     * Deletes a given API key.
     */
    public function delete(ClientApiRequest $request, string $identifier): JsonResponse
    {
        /** @var ApiKey $key */
        $key = $request->user()->apiKeys()
            ->where('identifier', $identifier)
            ->firstOrFail();

        Activity::event('user:api-key.delete')
            ->property('identifier', $key->identifier)
            ->log();

        $key->delete();

        return new JsonResponse([], JsonResponse::HTTP_NO_CONTENT);
    }
}
