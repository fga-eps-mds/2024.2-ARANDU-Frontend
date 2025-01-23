'use client';

import { Box, TextField } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import MyButton from '@/components/ui/buttons/myButton.component';

import { subjectSchema, SubjectSchemaData } from '@/lib/schemas/subjects.schema';
import {
    createSubject,
    updateSubjectById,
} from '@/services/studioMaker.service';

export function SubjectForm({ callback, subject, setDialog, pointId }: any) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SubjectSchemaData>({
        resolver: zodResolver(subjectSchema),
        defaultValues: {
            title: subject ? subject.title : '',
        },
    });

    const onSubmit: SubmitHandler<SubjectSchemaData> = async (data) => {
        const response = subject
            ? await updateSubjectById({
                id: subject._id,
                data,
                token: JSON.parse(localStorage.getItem('token')!),
            })
            : await createSubject({
                data: { pointId, ...data },
                token: JSON.parse(localStorage.getItem('token')!),
            });
        if (response.data) {
            toast.success('Assunto atualizado com sucesso!');
            callback(response.data);
            setDialog(false);
        } else {
            toast.error('Ocorreu um erro, tente novamente');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
                fullWidth
                variant="outlined"
                label="Título do Assunto"
                margin="normal"
                required
                sx={{ bgcolor: 'white' }}
                {...register('title')}
                error={!!errors.title}
            />
            <MyButton type="submit" width="100%" height="50px" color="black" bold>
                {subject ? 'Atualizar Assunto' : 'Criar Assunto'}
            </MyButton>
        </Box>
    );
}
