import http from '@/api/http';
import { ApiKey, rawDataToApiKey } from '@/api/account/getApiKeys';
import { Permission } from '@/components/dashboard/forms/CreateApiKeyForm';

export default (description: string, allowedIps: string, isAdmin?: boolean, permissions?: Permission): Promise<ApiKey & { secretToken: string }> => {
    return new Promise((resolve, reject) => {
        http.post(`/api/client/account/api-keys${isAdmin ? '/application' : ''}`, {
            description,
            allowed_ips: allowedIps.length > 0 ? allowedIps.split('\n') : [],
            permissions: isAdmin ? permissions : null,
        })
            .then(({ data }) =>
                resolve({
                    ...rawDataToApiKey(data.attributes),
                    // eslint-disable-next-line camelcase
                    secretToken: data.meta?.secret_token ?? '',
                })
            )
            .catch(reject);
    });
};
