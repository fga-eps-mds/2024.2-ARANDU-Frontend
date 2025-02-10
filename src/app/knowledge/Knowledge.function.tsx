import { Knowledge } from "@/lib/interfaces/knowledge.interface";
import { deleteKnowledge, GetKnowledge } from "@/services/studioMaker.service";
import { toast } from "sonner";

export const fecthKnowledge = async (
    setListKnowledge: React.Dispatch<React.SetStateAction<Knowledge[]>>,
    setFilteredKnowledge: React.Dispatch<React.SetStateAction<Knowledge[]>>
): Promise<Knowledge[]> => {
    let knowledge: Knowledge[];
    knowledge = await GetKnowledge(); // Busca todas as disciplinas

    // Ordena os knowledges pelo campo 'order'
    knowledge.sort((a, b) => a.order - b.order);

    // Atualiza os estados com as disciplinas ordenadas
    setListKnowledge(knowledge);
    setFilteredKnowledge(knowledge);

    return knowledge;
};
export const addKnowledge = (
    Knowlegde: Knowledge,
    listKnowledge: Knowledge[],
    setListKnowledges: React.Dispatch<React.SetStateAction<Knowledge[]>>
) => {
    // Verificar se listKnowledges não é undefined ou null
    if (listKnowledge && Array.isArray(listKnowledge)) {
        setListKnowledges(
            [...listKnowledge, Knowlegde].sort((a, b) => a.order - b.order),
        );
    }
};

export const updateKnowledge = (knowledge: Knowledge, listKnowledge: Knowledge[], setListKnowledge: React.Dispatch<React.SetStateAction<Knowledge[]>>) => {
    // Verificar se listSubjects não é undefined ou null
    if (listKnowledge && Array.isArray(listKnowledge)) {
        setListKnowledge(
            listKnowledge.map((s) => (s._id === knowledge._id ? knowledge : s)),
        );
    }
};

export const handleKnowledgeAction = (
    action: string,
    setEditionDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setExclusionDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
    if (action === 'editar') {
        setEditionDialogOpen(true);
    }
    if (action === 'excluir') {
        setExclusionDialogOpen(true);
    }
};

export const handleRemoveKnowledge = async (
    knowledge: Knowledge,
    listKnowledges: Knowledge[],
    setListKnowledges: React.Dispatch<React.SetStateAction<Knowledge[]>>,
    setExclusionDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
    const response = await deleteKnowledge({
        id: knowledge._id,
        token: JSON.parse(localStorage.getItem('token')!),
    });
    if (response.data) {
        toast.success('Disciplina excluída com sucesso!');
        setListKnowledges(listKnowledges.filter((s) => s._id !== knowledge._id));
        setExclusionDialogOpen(false);
    } else {
        toast.error('Erro ao excluir disciplina. Tente novamente mais tarde!');
    }
};

export const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    knowledge: Knowledge,
    setAnchorEl: React.Dispatch<React.SetStateAction<null | HTMLElement>>,
    setSelectedKnowledge: React.Dispatch<React.SetStateAction<Knowledge | null>>
) => {
    setAnchorEl(event.currentTarget);
    setSelectedKnowledge(knowledge);
};

export const handleMenuClose = (setAnchorEl: React.Dispatch<React.SetStateAction<null | HTMLElement>>,) => {
    setAnchorEl(null);
};
