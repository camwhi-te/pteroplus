import * as React from 'react';
import PageContentBlock from '@/components/elements/PageContentBlock';
import ContentBox from '@/components/elements/ContentBox';
import Switch from '@/components/elements/Switch';
import { usePersistedState } from '@/plugins/usePersistedState';
import { Alert } from '@/components/elements/alert';

export default () => {
    const [simpleConsole, setSimpleConsole] = usePersistedState<boolean>('pteroplus:simpleConsole', false);
    const [gridFileManager, setGridFileManager] = usePersistedState<boolean>('pteroplus:gridFileManager', false);
    const [navbarControls, setNavbarControls] = usePersistedState<boolean>('pteroplus:navbarControls', true);

    return (
        <PageContentBlock title={'Account Settings'}>
            <Alert type={'info'} className={'mb-4'}>
                Settings changed here will only persist on this device. If you log in on another device, you may have to
                change these settings again.
            </Alert>
            <div className={'grid lg:grid-cols-3 gap-8'}>
                <ContentBox title={'Appearance'} description={'Adjust settings for the user interface.'}>
                    <div className={`bg-neutral-900 p-4 rounded-lg border border-neutral-500`}>
                        <Switch
                            name='simpleConsole'
                            label='Use simple console layout'
                            description='Choosing this option will simplify the server console page by reducing content.'
                            defaultChecked={simpleConsole}
                            onChange={() => setSimpleConsole((s) => !s)}
                        />
                    </div>
                    <div className={`mt-4 bg-neutral-900 p-4 rounded-lg border border-neutral-500`}>
                        <Switch
                            name='gridFileManager'
                            label='Use grid for file manager'
                            description='Choosing this option will display files and folders in a grid rather than a row.'
                            defaultChecked={gridFileManager}
                            onChange={() => setGridFileManager((s) => !s)}
                        />
                    </div>
                </ContentBox>
                <ContentBox title={'Functions'} description={'Change behaviours based on your preferences.'}>
                    <div className={`bg-neutral-900 p-4 rounded-lg border border-neutral-500`}>
                        <Switch
                            name='navbarControls'
                            label='Add extra controls to server navbar'
                            description='Choosing this option will add an extra control bar to servers when navigating outside the console page.'
                            defaultChecked={navbarControls}
                            onChange={() => setNavbarControls((s) => !s)}
                        />
                    </div>
                </ContentBox>
                <ContentBox title={'Security'} description={'Define security rules and processes for your account.'}>
                    {/* */}
                </ContentBox>
            </div>
        </PageContentBlock>
    );
};
