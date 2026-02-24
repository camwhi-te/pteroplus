import * as React from 'react';
import ContentBox from '@/components/elements/ContentBox';
import UpdatePasswordForm from '@/components/dashboard/forms/UpdatePasswordForm';
import UpdateEmailAddressForm from '@/components/dashboard/forms/UpdateEmailAddressForm';
import PageContentBlock from '@/components/elements/PageContentBlock';
import tw from 'twin.macro';
import { breakpoint } from '@/theme';
import styled from 'styled-components/macro';
import MessageBox from '@/components/MessageBox';
import { useLocation } from 'react-router-dom';
import ActivityLogContainer from './activity/ActivityLogContainer';

const Container = styled.div`
    ${tw`flex flex-wrap`};

    & > div {
        ${tw`w-full`};

        ${breakpoint('sm')`
      width: calc(50% - 1rem);
    `}

        ${breakpoint('md')`
      ${tw`w-auto flex-1`};
    `}
    }
`;

export default () => {
    const { state } = useLocation<undefined | { twoFactorRedirect?: boolean }>();

    return (
        <PageContentBlock title={'Account Overview'}>
            {state?.twoFactorRedirect && (
                <MessageBox title={'2-Factor Required'} type={'error'}>
                    Your account must have two-factor authentication enabled in order to continue.
                </MessageBox>
            )}

            <Container css={[tw`lg:grid lg:grid-cols-3 mb-10`, state?.twoFactorRedirect ? tw`mt-4` : tw`mt-10`]}>
                <ContentBox
                    title={'Update Password'}
                    showFlashes={'account:password'}
                    description={'Keep your account secure by updating your password.'}
                >
                    <UpdatePasswordForm />
                </ContentBox>
                <ContentBox
                    className={`mt-8 sm:mt-0 sm:ml-8`}
                    title={'Update Email Address'}
                    showFlashes={'account:email'}
                    description={'Change the email address linked to your account.'}
                >
                    <UpdateEmailAddressForm />
                </ContentBox>
                <ContentBox
                    className={`mt-8 sm:mt-0 sm:ml-8`}
                    title={'Account Activity'}
                    showFlashes={'account:activity'}
                    description={'View the latest changes to your account.'}
                >
                    <ActivityLogContainer />
                </ContentBox>
            </Container>
        </PageContentBlock>
    );
};
