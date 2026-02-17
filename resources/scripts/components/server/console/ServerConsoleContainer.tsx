import React, { memo } from 'react';
import { ServerContext } from '@/state/server';
import Can from '@/components/elements/Can';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import isEqual from 'react-fast-compare';
import Spinner from '@/components/elements/Spinner';
import Features from '@feature/Features';
import Console from '@/components/server/console/Console';
import StatGraphs from '@/components/server/console/StatGraphs';
import PowerButtons from '@/components/server/console/PowerButtons';
import ServerDetailsBlock from '@/components/server/console/ServerDetailsBlock';
import { Alert } from '@/components/elements/alert';
import { ip } from '@/lib/formatters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { statusToColor } from '@/routers/ServerRouter';
import { usePersistedState } from '@/plugins/usePersistedState';

export type PowerAction = 'start' | 'stop' | 'restart' | 'kill';

const ServerConsoleContainer = () => {
    const [simpleConsole, _] = usePersistedState<boolean>('simpleConsole', false);

    const name = ServerContext.useStoreState((state) => state.server.data!.name);
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const description = ServerContext.useStoreState((state) => state.server.data!.description);
    const isInstalling = ServerContext.useStoreState((state) => state.server.isInstalling);
    const isTransferring = ServerContext.useStoreState((state) => state.server.data!.isTransferring);
    const eggFeatures = ServerContext.useStoreState((state) => state.server.data!.eggFeatures, isEqual);
    const isNodeUnderMaintenance = ServerContext.useStoreState((state) => state.server.data!.isNodeUnderMaintenance);
    const status = ServerContext.useStoreState((state) => state.status.value);

    const allocation = ServerContext.useStoreState((state) => {
        const match = state.server.data!.allocations.find((allocation) => allocation.isDefault);

        return !match ? 'n/a' : `${match.alias || ip(match.ip)}:${match.port}`;
    });

    return (
        <ServerContentBlock title={'Console'}>
            {(isNodeUnderMaintenance || isInstalling || isTransferring) && (
                <Alert type={'warning'} className={'mb-4'}>
                    {isNodeUnderMaintenance
                        ? 'The node of this server is currently under maintenance and all actions are unavailable.'
                        : isInstalling
                        ? 'This server is currently running its installation process and most actions are unavailable.'
                        : 'This server is currently being transferred to another node and all actions are unavailable.'}
                </Alert>
            )}
            <div className={'grid grid-cols-4 gap-4 mb-4'}>
                {!simpleConsole && (
                    <>
                        <div className={'hidden sm:block h-full sm:col-span-2 lg:col-span-3 bg-black/50 rounded-xl'}>
                            <div className={'flex items-center h-full my-auto lg:px-4'}>
                                <FontAwesomeIcon
                                    icon={faCircle}
                                    className={classNames(statusToColor(status), 'w-3 h-3 my-auto animate-pulse')}
                                />
                                <div className={'ml-3'}>
                                    <h1 className={'font-semibold text-2xl text-gray-50 line-clamp-1'}>{name}</h1>
                                    <p className={'text-2xs text-neutral-300 line-clamp-2'}>
                                        {description ?? <>Connected to {allocation}</>} &bull; {uuid}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div
                            className={
                                'bg-black/50 w-full h-full p-4 rounded-xl col-span-4 sm:col-span-2 lg:col-span-1 self-center'
                            }
                        >
                            <Can action={['control.start', 'control.stop', 'control.restart']} matchAny>
                                <PowerButtons className={'flex sm:justify-end space-x-2'} />
                            </Can>
                        </div>
                    </>
                )}
            </div>
            <div className={'grid grid-cols-4 gap-2 sm:gap-4 mb-4'}>
                <div className={'flex col-span-4 lg:col-span-3'}>
                    <Spinner.Suspense>
                        <Console />
                    </Spinner.Suspense>
                </div>
                <ServerDetailsBlock className={'col-span-4 lg:col-span-1 order-last lg:order-none'} />
                {simpleConsole && (
                    <Can action={['control.start', 'control.stop', 'control.restart']} matchAny>
                        <PowerButtons className={'flex sm:justify-end space-x-2'} />
                    </Can>
                )}
            </div>
            {!simpleConsole && (
                <div className={'grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4'}>
                    <Spinner.Suspense>
                        <StatGraphs />
                    </Spinner.Suspense>
                </div>
            )}
            <Features enabled={eggFeatures} />
        </ServerContentBlock>
    );
};

export default memo(ServerConsoleContainer, isEqual);
