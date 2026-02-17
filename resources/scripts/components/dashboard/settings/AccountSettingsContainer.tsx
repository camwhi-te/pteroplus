import * as React from 'react';
import PageContentBlock from '@/components/elements/PageContentBlock';
import ContentBox from '@/components/elements/ContentBox';
import Switch from '@/components/elements/Switch';
import { usePersistedState } from '@/plugins/usePersistedState';

export default () => {
    const [simpleConsole, setSimpleConsole] = usePersistedState<boolean>('simpleConsole', false);

    return (
        <PageContentBlock title={'Account Settings'}>
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
                </ContentBox>
                <ContentBox title={'Functions'} description={'Change behaviours based on your preferences.'}>
                    {/* */}
                </ContentBox>
                <ContentBox title={'Security'} description={'Define security rules and processes for your account.'}>
                    {/* */}
                </ContentBox>
            </div>
        </PageContentBlock>
    );
};
