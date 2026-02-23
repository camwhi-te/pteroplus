import React, { useEffect, useState } from 'react';
import { Field as FormikField, Form, Formik, FormikHelpers, useFormikContext } from 'formik';
import { boolean, object, string } from 'yup';
import Field from '@/components/elements/Field';
import FormikFieldWrapper from '@/components/elements/FormikFieldWrapper';
import useFlash from '@/plugins/useFlash';
import createServerBackup from '@/api/server/backups/createServerBackup';
import FlashMessageRender from '@/components/FlashMessageRender';
import { Button } from '@/components/elements/button';
import { Textarea } from '@/components/elements/Input';
import getServerBackups from '@/api/swr/getServerBackups';
import { ServerContext } from '@/state/server';
import FormikSwitch from '@/components/elements/FormikSwitch';
import Can from '@/components/elements/Can';
import { Dialog, DialogProps } from '@/components/elements/dialog';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';

interface Values {
    name: string;
    ignored: string;
    isLocked: boolean;
}

const ModalContent = ({ ...props }: DialogProps) => {
    const { isSubmitting } = useFormikContext<Values>();

    return (
        <Dialog {...props}>
            <SpinnerOverlay visible={isSubmitting} />
            <Form>
                <FlashMessageRender byKey={'backups:create'} className={`mb-4`} />
                <h2 className={`text-2xl mb-6`}>Create server backup</h2>
                <Field
                    name={'name'}
                    label={'Backup name'}
                    description={'If provided, the name that should be used to reference this backup.'}
                />
                <div className={`mt-6`}>
                    <FormikFieldWrapper
                        name={'ignored'}
                        label={'Ignored Files & Directories'}
                        description={`
                            Enter the files or folders to ignore while generating this backup. Leave blank to use
                            the contents of the .pteroignore file in the root of the server directory if present.
                            Wildcard matching of files and folders is supported in addition to negating a rule by
                            prefixing the path with an exclamation point.
                        `}
                    >
                        <FormikField as={Textarea} name={'ignored'} rows={6} />
                    </FormikFieldWrapper>
                </div>
                <Can action={'backup.delete'}>
                    <div className={`mt-6 bg-neutral-800 border border-neutral-800 shadow-inner p-4 rounded`}>
                        <FormikSwitch
                            name={'isLocked'}
                            label={'Locked'}
                            description={'Prevents this backup from being deleted until explicitly unlocked.'}
                        />
                    </div>
                </Can>
                <div className={`flex justify-end mt-6`}>
                    <Button type={'submit'} disabled={isSubmitting}>
                        Start backup
                    </Button>
                </div>
            </Form>
        </Dialog>
    );
};

export default () => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const [visible, setVisible] = useState(false);
    const { mutate } = getServerBackups();

    useEffect(() => {
        clearFlashes('backups:create');
    }, [visible]);

    const submit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes('backups:create');
        createServerBackup(uuid, values)
            .then((backup) => {
                mutate(
                    (data) => ({ ...data, items: data.items.concat(backup), backupCount: data.backupCount + 1 }),
                    false
                );
                setVisible(false);
            })
            .catch((error) => {
                clearAndAddHttpError({ key: 'backups:create', error });
                setSubmitting(false);
            });
    };

    return (
        <>
            {visible && (
                <Formik
                    onSubmit={submit}
                    initialValues={{ name: '', ignored: '', isLocked: false }}
                    validationSchema={object().shape({
                        name: string().max(191),
                        ignored: string(),
                        isLocked: boolean(),
                    })}
                >
                    <ModalContent open={visible} onClose={() => setVisible(false)} />
                </Formik>
            )}
            <Button className={`w-full sm:w-auto`} onClick={() => setVisible(true)}>
                Create backup
            </Button>
        </>
    );
};
