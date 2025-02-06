'use client';
import { Knowledge } from "@/lib/interfaces/knowledge.interface";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { addKnowledge, fecthKnowledge, handleMenuClose, handleMenuOpen, handleKnowledgeAction, updateKnowledge } from "./Knowledge.function";
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import SearchBar from "@/components/admin/SearchBar";
import ButtonRed from "@/components/ui/buttons/red.button";
import Popup from "@/components/ui/popup";
import { KnowledgeForm } from "@/components/forms/knowledge.form";
import { handleRemoveKnowledge } from "../knowledge/Knowledge.function";
import KnowledgeTable from "@/components/tables/knowledge.table";

export default function KnowledgePage({ }) {
    const [listKnowledge, setListKnowledge] = useState<Knowledge[]>([])
    const [filteredKnowledge, setFilteredKnowledge] = useState<Knowledge[]>([])

    const {
        isLoading,
        error
    } = useQuery<Knowledge[], Error>({
        queryKey: ['knowledge'],
        queryFn: () => fecthKnowledge(setListKnowledge, setFilteredKnowledge),
    });

    const [searchQuery, setSearchQuery] = useState<string>('');

    const [selectedKnowledge, setSelectedKnowledge] = useState<Knowledge | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [exclusionDialogOpen, setExclusionDialogOpen] = useState<boolean>(false);
    const [editionDialogOpen, setEditionDialogOpen] = useState<boolean>(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    useEffect(() => {
        if (searchQuery === '') {
            setFilteredKnowledge(listKnowledge);
        } else {
            const lowercasedQuery = searchQuery.toLowerCase();
            const filtered = listKnowledge.filter((knowledge) => {
                return (
                    knowledge.name.toLowerCase().includes(lowercasedQuery) ||
                    knowledge.description.toLowerCase().includes(lowercasedQuery)
                );
            });

            setFilteredKnowledge(filtered);
        }
    }, [searchQuery, listKnowledge]);

    if (isLoading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography>Error fetching knowledge</Typography>;
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
            <h1 className="text-blac font-bold text-4xl">Áreas do Conhecimento</h1>
            <Box sx={{ width: '80%', maxWidth: 700, marginBottom: 2 }}>
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </Box>
            <Box sx={{ width: '100%', maxWidth: 800 }}>
                <KnowledgeTable
                    knowledge={filteredKnowledge}
                    anchorEl={anchorEl}
                    onMenuClick={(event, knowledge) => handleMenuOpen(event, knowledge, setAnchorEl, setSelectedKnowledge)}
                    onMenuClose={() => handleMenuClose(setAnchorEl)}
                    onKnowledgeAction={(action) => handleKnowledgeAction(action, setEditionDialogOpen, setExclusionDialogOpen)}
                />
            </Box>

            <ButtonRed onClick={() => setCreateDialogOpen(true)}>
                Nova Área do Conhecimento
            </ButtonRed>

            <Popup
                openPopup={editionDialogOpen}
                setPopup={setEditionDialogOpen}
                title="Editar Área do Conhecimento"
            >
                <KnowledgeForm
                    callback={(knowledge: Knowledge) => updateKnowledge(knowledge, listKnowledge, setListKnowledge)}
                    knowledge={selectedKnowledge!}
                    setDialog={setEditionDialogOpen}
                />
            </Popup>

            <Popup
                openPopup={createDialogOpen}
                setPopup={setCreateDialogOpen}
                title="Criar Nova Área do Conhecimento"
            >
                <KnowledgeForm
                    callback={(knowledge: Knowledge) => addKnowledge(knowledge, listKnowledge, setListKnowledge)}
                    setDialog={setCreateDialogOpen}
                />
            </Popup>

            <Dialog
                open={exclusionDialogOpen}
                onClose={() => setExclusionDialogOpen(false)}
            >
                <DialogTitle>Confirmar Exclusão de Área do Conhecimento</DialogTitle>
                <DialogContent>
                    {selectedKnowledge && (
                        <Typography variant="h6">{`Excluir ${selectedKnowledge.name}?`}</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setExclusionDialogOpen(false)} color="error">
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => handleRemoveKnowledge(selectedKnowledge!, listKnowledge, setListKnowledge, setExclusionDialogOpen)}
                        color="primary"
                    >
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

