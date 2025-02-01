// subjectFunctions.ts
import { Subject } from '@/lib/interfaces/subjetc.interface';
import { deleteSubjects } from '@/services/studioMaker.service';
import { toast } from 'sonner';

export const updateSubject = (subject: Subject, listSubjects: Subject[], setListSubjects: React.Dispatch<React.SetStateAction<Subject[]>>) => {
    // Verificar se listSubjects não é undefined ou null
    if (listSubjects && Array.isArray(listSubjects)) {
        setListSubjects(
            listSubjects.map((s) => (s._id === subject._id ? subject : s)),
        );
    }
};

export const addSubject = (
    subject: Subject,
    listSubjects: Subject[],
    setListSubjects: React.Dispatch<React.SetStateAction<Subject[]>>
) => {
    // Verificar se listSubjects não é undefined ou null
    if (listSubjects && Array.isArray(listSubjects)) {
        setListSubjects(
            [...listSubjects, subject].sort((a, b) => a.order - b.order),
        );
    }
};

export const handleSubjectAction = (
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

export const handleRemoveSubject = async (
    subject: Subject,
    listSubjects: Subject[],
    setListSubjects: React.Dispatch<React.SetStateAction<Subject[]>>,
    setExclusionDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
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

export const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    subject: Subject,
    setAnchorEl: React.Dispatch<React.SetStateAction<null | HTMLElement>>,
    setSelectedSubject: React.Dispatch<React.SetStateAction<Subject | null>>
) => {
    setAnchorEl(event.currentTarget);
    setSelectedSubject(subject);
};

