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
            name: subject ? subject.name : '',
            description: subject ? subject.description : '',
        },
    });

    const onSubmit: SubmitHandler<SubjectSchemaData> = async (data) => {
        const token = JSON.parse(localStorage.getItem('token')!); // Obtém o token do localStorage
        const response = subject
            ? await updateSubjectById({
                id: subject._id,
                data,
                token,
            })
            : await createSubject({
                data: { pointId, ...data },
                token,
            });

        if (response?.data) {
            toast.success(subject ? 'Assunto atualizado com sucesso!' : 'Assunto criado com sucesso!');
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
                label="Nome da Disciplina"
                margin="normal"
                required
                sx={{ bgcolor: 'white' }}
                {...register('name')}
                error={!!errors.name}

            />
            <TextField
                fullWidth
                variant="outlined"
                label="Descrição"
                margin="normal"
                required
                multiline
                rows={4}
                sx={{ bgcolor: 'white' }}
                {...register('description')}
                error={!!errors.description}

            />
            <MyButton type="submit" width="100%" height="50px" color="black" bold>
                {subject ? 'Atualizar Assunto' : 'Criar Assunto'}
            </MyButton>
        </Box>
    );
}
