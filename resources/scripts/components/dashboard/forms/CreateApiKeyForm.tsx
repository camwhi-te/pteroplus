import React, { useState, Dispatch, SetStateAction } from 'react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import tw from 'twin.macro';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

import FormikFieldWrapper from '@/components/elements/FormikFieldWrapper';
import Input, { Textarea } from '@/components/elements/Input';
import { Button } from '@/components/elements/button';
import Switch from '@/components/elements/Switch';
import Label from '@/components/elements/Label';
import { Dialog } from '@/components/elements/dialog';
import { Alert } from '@/components/elements/alert';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import ApiKeyModal from '@/components/dashboard/ApiKeyDialog';

import createApiKey from '@/api/account/createApiKey';
import { httpErrorToHuman } from '@/api/http';
import { ApiKey } from '@/api/account/getApiKeys';
import { useStoreState, useStoreActions } from '@/state/hooks';

type PermissionValues = '0' | '1' | '2';
export type Permission = Record<string, PermissionValues>;

interface Values {
    description: string;
    allowedIps: string;
}

const CustomTextarea = styled(Textarea)`
    ${tw`h-32`}
`;

const PERMISSIONS: { id: string; label: string }[] = [
    { id: 'r_allocations', label: 'Allocations' },
    { id: 'r_database_hosts', label: 'Database Hosts' },
    { id: 'r_eggs', label: 'Eggs' },
    { id: 'r_nests', label: 'Nests' },
    { id: 'r_nodes', label: 'Nodes' },
    { id: 'r_server_databases', label: 'Server Databases' },
    { id: 'r_servers', label: 'Servers' },
    { id: 'r_users', label: 'User Accounts' },
];

const defaultPermissions: Record<string, PermissionValues> = PERMISSIONS.reduce(
    (acc, p) => ({ ...acc, [p.id]: '0' }),
    {}
);

const PermissionRow = ({
    id,
    label,
    permissions,
    setPermissions,
}: {
    id: string;
    label: string;
    permissions: Permission;
    setPermissions: Dispatch<SetStateAction<Permission>>;
}) => {
    const onChange = (value: PermissionValues) => setPermissions((prev) => ({ ...prev, [id]: value }));

    return (
        <div className={`mb-3 bg-neutral-900 rounded-lg p-3`}>
            <Label>{label}</Label>
            <div className='space-x-6'>
                {(['0', '1', '2'] as PermissionValues[]).map((val) => (
                    <label key={val} className={`inline-flex items-center mr-2`}>
                        <Input
                            type='radio'
                            name={id}
                            value={val}
                            checked={permissions[id] === val}
                            onChange={() => onChange(val)}
                        />
                        <span className={`text-neutral-300 ml-2`}>
                            {val === '0' ? 'No Access' : val === '1' ? 'Read Only' : 'Read & Write'}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default ({ onKeyCreated }: { onKeyCreated: (key: ApiKey) => void }) => {
    const [apiKey, setApiKey] = useState('');
    const [open, setOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [permissions, setPermissions] = useState<Permission>(defaultPermissions);

    const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
    const { addError, clearFlashes } = useStoreActions((actions) => actions.flashes);

    const submit = (values: Values, { setSubmitting, resetForm }: FormikHelpers<Values>) => {
        clearFlashes('account');
        createApiKey(values.description, values.allowedIps, isAdmin, permissions)
            .then(({ secretToken, ...key }) => {
                resetForm();
                setSubmitting(false);
                setApiKey(`${key.identifier}${secretToken}`);
                onKeyCreated(key);
            })
            .catch((error) => {
                console.error(error);
                addError({ key: 'account', message: httpErrorToHuman(error) });
                setSubmitting(false);
            });
    };

    return (
        <>
            <ApiKeyModal open={!!apiKey} onClose={() => setApiKey('')} apiKey={apiKey} />

            <Dialog open={open} onClose={() => setOpen(false)} title='Set Application API permissions'>
                {PERMISSIONS.map((p) => (
                    <PermissionRow
                        key={p.id}
                        id={p.id}
                        label={p.label}
                        permissions={permissions}
                        setPermissions={setPermissions}
                    />
                ))}
            </Dialog>

            <Formik
                initialValues={{ description: '', allowedIps: '' }}
                validationSchema={object().shape({
                    description: string().required().min(4),
                    allowedIps: string(),
                })}
                onSubmit={submit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <SpinnerOverlay visible={isSubmitting} />

                        <FormikFieldWrapper
                            label='Description'
                            name='description'
                            description='A description of this API key.'
                            className={`mb-6`}
                        >
                            <Field name='description' as={Input} />
                        </FormikFieldWrapper>

                        <FormikFieldWrapper
                            label='Allowed IPs'
                            name='allowedIps'
                            description='Leave blank to allow any IP address, otherwise provide each IP address on a new line.'
                        >
                            <Field name='allowedIps' as={CustomTextarea} />
                        </FormikFieldWrapper>

                        {rootAdmin && (
                            <div className={`mt-6 bg-neutral-900 p-4 rounded-lg border border-neutral-500`}>
                                <Switch
                                    name='isAdmin'
                                    label='Administrator Key'
                                    description='Do you want this key to be used for the Admin API?'
                                    defaultChecked={isAdmin}
                                    onChange={() => setIsAdmin((s) => !s)}
                                />
                            </div>
                        )}

                        {isAdmin && (
                            <Alert type='warning' className={`mt-6`}>
                                You should set the permissions for this API key before creating.
                            </Alert>
                        )}

                        <div className={`flex justify-end mt-6`}>
                            {isAdmin && (
                                <Button.Text
                                    type='button'
                                    className='mr-2'
                                    variant={Button.Variants.Secondary}
                                    onClick={() => setOpen(true)}
                                >
                                    <FontAwesomeIcon icon={faCog} className='mr-1' /> Set Permissions
                                </Button.Text>
                            )}
                            <Button>Create</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};
