import React, { useContext } from 'react';
import { Button } from '@/components/elements/button';
import asDialog from '@/hoc/asDialog';
import CopyOnClick from '@/components/elements/CopyOnClick';
import { DialogWrapperContext } from '../elements/dialog';

interface Props {
    apiKey: string;
}

const ApiKeyDialog = ({ apiKey }: Props) => {
    const { close } = useContext(DialogWrapperContext);

    return (
        <>
            <pre className={`mt-6 text-sm bg-neutral-900 rounded py-2 px-4 font-mono`}>
                <CopyOnClick text={apiKey}>
                    <code className={`font-mono`}>{apiKey}</code>
                </CopyOnClick>
            </pre>
            <div className={`flex justify-end mt-6`}>
                <Button type={'button'} onClick={close}>
                    Close
                </Button>
            </div>
        </>
    );
};

export default asDialog({
    title: 'Your API Key',
    description: 'he API key you have requested is shown below.',
})(ApiKeyDialog);
