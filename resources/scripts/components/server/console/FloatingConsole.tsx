import { faExternalLinkAlt, faTerminal } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import Draggable from 'react-draggable';

export default ({ src }: { src: string }) => {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            {!open ? (
                <div onClick={() => setOpen(true)}>
                    <FontAwesomeIcon icon={faTerminal} fixedWidth />
                </div>
            ) : (
                <FontAwesomeIcon icon={faExternalLinkAlt} fixedWidth />
            )}

            {open && (
                <Draggable handle='.window-header'>
                    <div className='fixed top-20 left-20 w-[600px] h-[400px] bg-white shadow-xl rounded-lg z-50 flex flex-col'>
                        <div className='window-header cursor-move bg-neutral-800 text-white px-4 py-2 flex justify-between items-center rounded-t-lg'>
                            <span className={'text-sm font-semibold'}>
                                <FontAwesomeIcon icon={faTerminal} className={'mr-2'} /> Console
                            </span>
                            <button onClick={() => setOpen(false)}>✕</button>
                        </div>

                        <iframe src={src} className='flex-1 w-full rounded-b-lg' />
                    </div>
                </Draggable>
            )}
        </>
    );
};
