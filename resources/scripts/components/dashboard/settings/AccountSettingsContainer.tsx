import * as React from 'react';
import PageContentBlock from '@/components/elements/PageContentBlock';
import ContentBox from '@/components/elements/ContentBox';
import Switch from '@/components/elements/Switch';
import { Alert } from '@/components/elements/alert';
import ConfigureTwoFactorForm from '../forms/ConfigureTwoFactorForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { GET, pteroplusSettings, SET, usePteroplusConfig } from '@/plugins/usePteroplusConfig';

export default () => {
    const settings = usePteroplusConfig(pteroplusSettings);

    const toggleSwitch = (key: keyof typeof pteroplusSettings, label: string, description: string) => {
        const [value, setValue] = settings[key];

        return (
            <div className='bg-neutral-900 p-4 rounded-lg border border-neutral-500'>
                <Switch
                    name={key}
                    label={label}
                    description={description}
                    defaultChecked={value}
                    onChange={() => setValue(!value)}
                />
            </div>
        );
    };

    return (
        <PageContentBlock title='Account Settings'>
            {settings.settings_warning[GET] && (
                <div className='relative'>
                    <Alert type='info' className='mb-4'>
                        <div
                            className='absolute top-1/2 right-4 -translate-y-1/2 text-xs'
                            onClick={() => settings.settings_warning[SET](false)}
                        >
                            <button className='bg-black/50 rounded px-2 py-1'>
                                Dismiss <FontAwesomeIcon icon={faCheckCircle} />
                            </button>
                        </div>
                        Settings changed here will only persist on this device. If you log in on another device, you may
                        have to change these settings again.
                    </Alert>
                </div>
            )}

            <div className='grid lg:grid-cols-3 gap-8'>
                <ContentBox title='Appearance' description='Adjust settings for the user interface.'>
                    <div className={'grid space-y-4'}>
                        {toggleSwitch(
                            'simple_console',
                            'Use simple console layout',
                            'Simplifies the server console page.'
                        )}
                        {toggleSwitch('grid_layout', 'Use grid for file manager', 'Displays files/folders in a grid.')}
                    </div>
                </ContentBox>

                <ContentBox title='Functions' description='Change behaviours based on your preferences.'>
                    {toggleSwitch(
                        'navbar_controls',
                        'Add extra controls to server navbar',
                        'Adds an extra control bar when navigating outside the console page.'
                    )}
                </ContentBox>

                <ContentBox title='Security' description='Define security rules and processes for your account.'>
                    <ConfigureTwoFactorForm />
                </ContentBox>
            </div>
        </PageContentBlock>
    );
};
