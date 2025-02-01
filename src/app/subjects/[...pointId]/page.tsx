'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Typography,
    CircularProgress,
} from '@mui/material';
import ButtonRed from '@/components/ui/buttons/red.button';
import SearchBar from '@/components/admin/SearchBar';
import SubjectTable from '@/components/tables/subject.table';
import { Subject } from '@/lib/interfaces/subjetc.interface';
import {
    deleteSubjects,
    GetSubjectsByUserId,
    GetSubjects
} from '@/services/studioMaker.service';
import Popup from '@/components/ui/popup';
import { SubjectForm } from '@/components/forms/subject.form';
import { toast } from 'sonner';
import { updateSubject, addSubject } from './subject.functions';

export default function SubjectPage({
    params,
}: {
    readonly params: { pointId: string };
}) {
    const fetchSubjects = async (): Promise<Subject[]> => {
        let subjects: Subject[];

        if (params.pointId == "admin") {
            subjects = await GetSubjects();
        } else {

            subjects = await GetSubjectsByUserId(params.pointId);
        }
        subjects.sort((a, b) => a.order - b.order);
        setListSubjects(subjects);
        setFilteredSubjects(subjects);
        return subjects;
    };

    const {
        data = [],
        isLoading,
        error,
    } = useQuery<Subject[], Error>({
        queryKey: ['subjects', params.pointId],
        queryFn: fetchSubjects,
    });

    const [listSubjects, setListSubjects] = useState<Subject[]>([]);
    const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [exclusionDialogOpen, setExclusionDialogOpen] =
        useState<boolean>(false);
    const [editionDialogOpen, setEditionDialogOpen] = useState<boolean>(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    useEffect(() => {
        if (searchQuery === '') {
            setFilteredSubjects(listSubjects);
        } else {
            const lowercasedQuery = searchQuery.toLowerCase();
            const filtered = listSubjects.filter((subject) => {
                return (
                    subject.name.toLowerCase().includes(lowercasedQuery) ||
                    subject.description.toLowerCase().includes(lowercasedQuery)
                );
            });

            setFilteredSubjects(filtered);
        }
    }, [searchQuery, listSubjects]);


    const handleMenuOpen = (
        event: React.MouseEvent<HTMLButtonElement>,
        subject: Subject,
    ) => {
        setAnchorEl(event.currentTarget);
        setSelectedSubject(subject);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSubjectAction = (action: string) => {
        if (action === 'editar') setEditionDialogOpen(true);
        if (action === 'excluir') setExclusionDialogOpen(true);
    };

    const handleRemoveSubject = async (subject: Subject) => {
        const response = await deleteSubjects({
            id: subject._id,
            token: JSON.parse(localStorage.getItem('token')!),
        });
        if (response.data) {
            toast.success('Disciplina excluída com sucesso!');
            setListSubjects(listSubjects.filter((s) => s._id !== subject._id));
            setExclusionDialogOpen(false);
        } else {
            toast.error('Erro ao excluir disciplina. Tente novamente mais tarde!');
        }
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography>Error fetching subjects</Typography>;
    }

    return (
        <Box
            sx={{
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography variant="h2">Disciplinas</Typography>
            <Box sx={{ width: '100%', maxWidth: 800, marginBottom: 2 }}>
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </Box>

            <Box sx={{ width: '100%', maxWidth: 800, marginBottom: 2 }}>
                <SubjectTable
                    subjects={filteredSubjects}
                    anchorEl={anchorEl}
                    onMenuClick={handleMenuOpen}
                    onMenuClose={handleMenuClose}
                    onSubjectAction={handleSubjectAction}
                />
            </Box>

            <ButtonRed onClick={() => setCreateDialogOpen(true)}>
                Nova Disciplina
            </ButtonRed>

            <Popup
                openPopup={editionDialogOpen}
                setPopup={setEditionDialogOpen}
                title="Editar Disciplina"
            >
                <SubjectForm
                    callback={(subject: Subject) => updateSubject(subject, listSubjects, setListSubjects)}
                    subject={selectedSubject!}
                    setDialog={setEditionDialogOpen}
                />

            </Popup>

            <Popup
                openPopup={createDialogOpen}
                setPopup={setCreateDialogOpen}
                title="Criar Nova Disciplina"
            >
                <SubjectForm
                    callback={(subject: Subject) => addSubject(subject, listSubjects, setListSubjects)}
                    setDialog={setCreateDialogOpen}
                />
            </Popup>

            <Dialog
                open={exclusionDialogOpen}
                onClose={() => setExclusionDialogOpen(false)}
            >
                <DialogTitle>Confirmar Exclusão de Disciplina</DialogTitle>
                <DialogContent>
                    {selectedSubject && (
                        <Typography variant="h6">{`Excluir ${selectedSubject.name}?`}</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setExclusionDialogOpen(false)} color="error">
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => handleRemoveSubject(selectedSubject!)}
                        color="primary"
                    >
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
