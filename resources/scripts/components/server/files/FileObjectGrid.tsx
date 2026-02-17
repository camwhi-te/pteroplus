import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faFileArchive, faFileImport, faFolder } from '@fortawesome/free-solid-svg-icons';
import { memo } from 'react';
import isEqual from 'react-fast-compare';
import { NavLink, useRouteMatch } from 'react-router-dom';
import tw from 'twin.macro';
import { join } from 'pathe';
import { FileObject } from '@/api/server/files/loadDirectory';
import FileDropdownMenu from '@/components/server/files/FileDropdownMenu';
import SelectFileCheckbox from '@/components/server/files/SelectFileCheckbox';
import { usePermissions } from '@/plugins/usePermissions';
import { ServerContext } from '@/state/server';
import { encodePathSegments } from '@/lib/helpers';

const Clickable: React.FC<{ file: FileObject }> = memo(({ file, children }) => {
    const [canRead] = usePermissions(['file.read']);
    const [canReadContents] = usePermissions(['file.read-content']);
    const directory = ServerContext.useStoreState((state) => state.files.directory);

    const match = useRouteMatch();

    return (file.isFile && (!file.isEditable() || !canReadContents)) || (!file.isFile && !canRead) ? (
        <div className='w-full h-full'>{children}</div>
    ) : (
        <NavLink
            className='w-full h-full'
            to={`${match.url}${file.isFile ? '/edit' : ''}#${encodePathSegments(join(directory, file.name))}`}
        >
            {children}
        </NavLink>
    );
}, isEqual);

function FileObjectRow({ file }: { file: FileObject }) {
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();

        const menuWidth = 200;
        const menuHeight = 300;

        const { clientX, clientY } = e;

        let adjustedX = clientX + window.scrollX;
        let adjustedY = clientY + window.scrollY;

        if (adjustedX + menuWidth > window.innerWidth) {
            adjustedX = window.innerWidth - menuWidth - 10;
        }

        if (adjustedY + menuHeight > window.innerHeight) {
            adjustedY = window.innerHeight - menuHeight - 10;
        }

        window.dispatchEvent(
            new CustomEvent(`pterodactyl:files:ctx:${file.key}`, {
                detail: { x: adjustedX, y: adjustedY },
            })
        );
    };

    return (
        <div
            className={'relative bg-neutral-800 rounded-lg'}
            key={file.name}
            onContextMenu={handleContextMenu}
            css={tw`
                w-full
                aspect-ratio[1/1]
                relative
            `}
        >
            <SelectFileCheckbox name={file.name} />
            <div className={'absolute top-0 right-0'}>
                <FileDropdownMenu file={file} hidden />
            </div>
            <Clickable file={file}>
                <div className={'h-full w-full flex flex-col justify-center items-center'}>
                    <div className={'flex justify-center items-center mb-2'}>
                        {file.isFile ? (
                            <FontAwesomeIcon
                                size={'3x'}
                                icon={file.isSymlink ? faFileImport : file.isArchiveType() ? faFileArchive : faFileAlt}
                            />
                        ) : (
                            <FontAwesomeIcon size={'3x'} icon={faFolder} />
                        )}
                    </div>
                    <div className={'text-center truncate text-gray-400'}>{file.name}</div>
                </div>
            </Clickable>
        </div>
    );
}

export default memo(FileObjectRow, (prevProps, nextProps) => {
    /* eslint-disable unused-imports/no-unused-vars */
    const { isArchiveType, isEditable, ...prevFile } = prevProps.file;
    const { isArchiveType: nextIsArchiveType, isEditable: nextIsEditable, ...nextFile } = nextProps.file;
    /* eslint-enable unused-imports/no-unused-vars */

    return isEqual(prevFile, nextFile);
});
