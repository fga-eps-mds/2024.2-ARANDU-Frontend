// subjectFunctions.ts
import { Subject } from '@/lib/interfaces/subjetc.interface';

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
