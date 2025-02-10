'use client';

import { Box, TextField } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import MyButton from '@/components/ui/buttons/myButton.component';

import { KnowledgeSchema, KnowledgeSchemaData } from '@/lib/schemas/knowledge.schema';
import {
    createKnowledges,
    createSubject,
    updateKnowledgeById,
    updateSubjectById,
} from '@/services/studioMaker.service';

export function KnowledgeForm({ callback, knowledge, setDialog, pointId }: any) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<KnowledgeSchemaData>({
        resolver: zodResolver(KnowledgeSchema),
        defaultValues: {
            name: knowledge ? knowledge.name : '',
            description: knowledge ? knowledge.description : '',
        },
    });

    const onSubmit: SubmitHandler<KnowledgeSchemaData> = async (data) => {
        const token = JSON.parse(localStorage.getItem('token')!);
        const response = knowledge
            ? await updateKnowledgeById({
                id: knowledge._id,
                data,
                token,
            })
            : await createKnowledges({
                data: { pointId, ...data },
                token,
            });

        if (response?.data) {
            toast.success(knowledge ? 'Assunto atualizado com sucesso!' : 'Assunto criado com sucesso!');
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
                {knowledge ? 'Atualizar Assunto' : 'Criar Assunto'}
            </MyButton>
        </Box>
    );
}
