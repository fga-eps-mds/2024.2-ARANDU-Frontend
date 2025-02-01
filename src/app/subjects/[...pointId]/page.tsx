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
import { updateSubject, addSubject, handleSubjectAction, handleRemoveSubject, handleMenuOpen, fetchSubjects } from './subject.functions';

export default function SubjectPage({
    params,
}: {
    readonly params: { pointId: string };
}) {

    const [listSubjects, setListSubjects] = useState<Subject[]>([]);
    const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);

    const {
        data = [],
        isLoading,
        error,
    } = useQuery<Subject[], Error>({
        queryKey: ['subjects', params.pointId],
        queryFn: () => fetchSubjects(params, setListSubjects, setFilteredSubjects), // Corrigido: Chamando a função corretamente com uma função anônima
    });

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


    const handleMenuClose = () => {
        setAnchorEl(null);
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
                    onMenuClick={(event, subject) => handleMenuOpen(event, subject, setAnchorEl, setSelectedSubject)}
                    onMenuClose={handleMenuClose}
                    onSubjectAction={(action) => handleSubjectAction(action, setEditionDialogOpen, setExclusionDialogOpen)}

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
                        onClick={() => handleRemoveSubject(selectedSubject!, listSubjects, setListSubjects, setExclusionDialogOpen)}
                        color="primary"
                    >
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
