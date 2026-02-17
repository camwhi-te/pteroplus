import React, { useEffect, useState } from 'react';
import { Button } from '@/components/elements/button/index';
import Can from '@/components/elements/Can';
import { ServerContext } from '@/state/server';
import { PowerAction } from '@/components/server/console/ServerConsoleContainer';
import { Dialog } from '@/components/elements/dialog';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faRecycle, faSkull, faStop } from '@fortawesome/free-solid-svg-icons';

interface PowerButtonProps {
    className?: string;
    small?: boolean;
}

export default ({ className, small }: PowerButtonProps) => {
    const [open, setOpen] = useState(false);
    const status = ServerContext.useStoreState((state) => state.status.value);
    const instance = ServerContext.useStoreState((state) => state.socket.instance);

    const killable = status === 'stopping';
    const onButtonClick = (
        action: PowerAction | 'kill-confirmed',
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ): void => {
        e.preventDefault();
        if (action === 'kill') {
            return setOpen(true);
        }

        if (instance) {
            setOpen(false);
            instance.send('set state', action === 'kill-confirmed' ? 'kill' : action);
        }
    };

    useEffect(() => {
        if (status === 'offline') {
            setOpen(false);
        }
    }, [status]);

    return (
        <div className={className}>
            <Dialog.Confirm
                open={open}
                hideCloseIcon
                onClose={() => setOpen(false)}
                title={'Forcibly Stop Process'}
                confirm={'Continue'}
                onConfirmed={onButtonClick.bind(this, 'kill-confirmed')}
            >
                Forcibly stopping a server can lead to data corruption.
            </Dialog.Confirm>
            <Can action={'control.start'}>
                <Button.Success
                    className={classNames('flex-1', small && 'w-6 h-6')}
                    disabled={status !== 'offline'}
                    onClick={onButtonClick.bind(this, 'start')}
                >
                    {small ? <FontAwesomeIcon icon={faPlay} size={'sm'} /> : 'Start'}
                </Button.Success>
            </Can>
            <Can action={'control.restart'}>
                <Button.Text
                    className={classNames('flex-1 mx-2', small && 'w-6 h-6')}
                    disabled={!status}
                    onClick={onButtonClick.bind(this, 'restart')}
                >
                    {small ? <FontAwesomeIcon icon={faRecycle} size={'sm'} /> : 'Restart'}
                </Button.Text>
            </Can>
            <Can action={'control.stop'}>
                <Button.Danger
                    className={classNames('flex-1', small && 'w-6 h-6')}
                    disabled={status === 'offline'}
                    onClick={onButtonClick.bind(this, killable ? 'kill' : 'stop')}
                >
                    {killable ? (
                        <>{small ? <FontAwesomeIcon icon={faSkull} size={'sm'} /> : 'Kill'}</>
                    ) : (
                        <>{small ? <FontAwesomeIcon icon={faStop} size={'sm'} /> : 'Stop'}</>
                    )}
                </Button.Danger>
            </Can>
        </div>
    );
};
