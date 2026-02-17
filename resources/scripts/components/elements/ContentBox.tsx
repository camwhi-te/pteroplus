import React from 'react';
import FlashMessageRender from '@/components/FlashMessageRender';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import tw from 'twin.macro';
import classNames from 'classnames';

type Props = Readonly<
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        title?: string;
        description?: string;
        borderColor?: string;
        showFlashes?: string | boolean;
        showLoadingOverlay?: boolean;
    }
>;

const ContentBox = ({
    title,
    description,
    borderColor,
    showFlashes,
    showLoadingOverlay,
    children,
    ...props
}: Props) => (
    <div {...props}>
        <div className={classNames((title || description) && 'mb-4')}>
            {title && <h2 className={`text-neutral-300 px-4 text-2xl`}>{title}</h2>}
            {description && <h2 className={`text-neutral-400 px-4`}>{description}</h2>}
        </div>
        {showFlashes && (
            <FlashMessageRender byKey={typeof showFlashes === 'string' ? showFlashes : undefined} className={`mb-4`} />
        )}
        <div css={[tw`bg-neutral-800 p-4 rounded shadow-lg relative`, !!borderColor && tw`border-t-4`]}>
            <SpinnerOverlay visible={showLoadingOverlay || false} />
            {children}
        </div>
    </div>
);

export default ContentBox;
