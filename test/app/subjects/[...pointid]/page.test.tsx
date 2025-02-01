import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import SubjectPage from '@/app/subjects/[...pointId]/page';
import { deleteSubjects, GetSubjects, GetSubjectsByUserId } from '@/services/studioMaker.service';
import { toast } from 'sonner';
import { useState } from 'react';
import { subjectSchema } from '@/lib/schemas/subjects.schema';
import { Subject } from '@/lib/interfaces/subjetc.interface';
import { addSubject, handleRemoveSubject, handleSubjectAction, updateSubject } from '@/app/subjects/[...pointId]/subject.functions';
// Mock de dados
const mockSubjects = [
    {
        _id: '1',
        name: 'Matemática',
        shortName: 'MAT',
        description: 'Disciplina de Matemática',
        user: 'user1',
        journeys: ['journey1'],
        order: 1,
        createdAt: '2024-01-01T12:00:00Z',
        updatedAt: '2024-01-02T12:00:00Z',
        __v: 0,
    },
    {
        _id: '2',
        name: 'História',
        shortName: 'HIST',
        description: 'Disciplina de História',
        user: 'user2',
        journeys: ['journey2'],
        order: 2,
        createdAt: '2024-01-03T12:00:00Z',
        updatedAt: '2024-01-04T12:00:00Z',
        __v: 0,
    },
];

// Mock dos serviços
jest.mock('@/services/studioMaker.service', () => ({
    GetSubjectsByUserId: jest.fn(),
    GetSubjects: jest.fn(),
    deleteSubjects: jest.fn(),
}));

// Mock do Toast
jest.mock('sonner', () => ({
    toast: { success: jest.fn(), error: jest.fn() },
}));

describe('SubjectPage', () => {
    const queryClient = new QueryClient();

    beforeEach(() => {
        jest.clearAllMocks();
        (GetSubjects as jest.Mock).mockResolvedValue(mockSubjects);
    });



    it('deve exibir o indicador de carregamento enquanto os dados são buscados', async () => {
        (GetSubjects as jest.Mock).mockReturnValue(new Promise(() => { }));

        render(
            <QueryClientProvider client={queryClient}>
                <SubjectPage params={{ pointId: 'admin' }} />
            </QueryClientProvider>
        );

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('getsubjectuserid', async () => {
        (GetSubjectsByUserId as jest.Mock).mockReturnValue(new Promise(() => { }));

        render(
            <QueryClientProvider client={queryClient}>
                <SubjectPage params={{ pointId: '12345' }} />
            </QueryClientProvider>
        );

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });



    it('deve adicionar um novo subject e ordenar a lista pela propriedade order', () => {

        const newSubject: Subject = {
            _id: '3',
            name: 'Geografia',
            shortName: 'GEO',
            description: 'Disciplina de Geografia',
            user: 'user3',
            journeys: ['journey3'],
            order: 3,
            createdAt: '2024-02-01T12:00:00Z',
            updatedAt: '2024-02-01T12:00:00Z',
            __v: 0,
        };

        // Hook para gerenciar o estado
        const { result } = renderHook(() => {
            const [listSubjects, setListSubjects] = useState(mockSubjects);
            return { listSubjects, setListSubjects };
        });

        // Chamar a função addSubject
        act(() => {
            addSubject(newSubject, result.current.listSubjects, result.current.setListSubjects);
        });

        // Verificar se o novo subject foi adicionado corretamente e se a lista está ordenada
        expect(result.current.listSubjects).toEqual([
            mockSubjects[0],  // História (order: 1)
            mockSubjects[1],  // Matemática (order: 2)
            newSubject,          // Geografia (order: 3)
        ]);
    });

    it("Deve atualizar a lista de subjects corretamente", async () => {
        const { result } = renderHook(() => {
            const [listSubjects, setListSubjects] = useState(mockSubjects);

            return { listSubjects, setListSubjects };
        });

        const updatedSubject: Subject = {
            _id: '1',
            name: 'Matemática Avançada',
            shortName: 'MAT',
            description: 'Disciplina de Matemática Avançada',
            user: 'user1',
            journeys: ['journey1'],
            order: 1,
            createdAt: '2024-01-01T12:00:00Z',
            updatedAt: '2024-01-02T12:00:00Z',
            __v: 0,
        };

        act(() => {
            updateSubject(updatedSubject, result.current.listSubjects, result.current.setListSubjects);
        });

        // Verifica se a lista foi atualizada corretamente
        expect(result.current.listSubjects).toEqual([
            updatedSubject,  // O primeiro item foi atualizado
            mockSubjects[1], // O segundo item permanece inalterado
        ]);
    });
}
);
describe("handleSubjectAction", () => {
    it("Deve abrir o Menu Editar se clicado em editar", async () => {
        const setEditionDialogOpen = jest.fn();
        const setExclusionDialogOpen = jest.fn();

        handleSubjectAction("editar", setEditionDialogOpen, setExclusionDialogOpen);

        expect(setEditionDialogOpen).toHaveBeenCalledWith(true);
        expect(setExclusionDialogOpen).not.toHaveBeenCalled();
    });

    it("Deve abrir o Menu Excluir se clicado em Excluir", async () => {
        const setEditionDialogOpen = jest.fn();
        const setExclusionDialogOpen = jest.fn();

        handleSubjectAction("excluir", setEditionDialogOpen, setExclusionDialogOpen);

        expect(setExclusionDialogOpen).toHaveBeenCalledWith(true);
        expect(setEditionDialogOpen).not.toHaveBeenCalled();
    });
});
describe("handleRemoveSubject", () => {

    const mockSubjectsRemove = {
        _id: '2',
        name: 'História',
        shortName: 'HIST',
        description: 'Disciplina de História',
        user: 'user2',
        journeys: ['journey2'],
        order: 2,
        createdAt: '2024-01-03T12:00:00Z',
        updatedAt: '2024-01-04T12:00:00Z',
        __v: 0,
    };
    it("Deve excluir a disciplina se solicitado", async () => {
        // Simulando a resposta de sucesso do deleteSubjects
        (deleteSubjects as jest.Mock).mockResolvedValue({ data: true }); // Mock de resposta bem-sucedida

        const { result } = renderHook(() => {
            const [listSubjects, setListSubjects] = useState(mockSubjects);
            return { listSubjects, setListSubjects };
        });

        const setExclusionDialogOpen = jest.fn();

        await act(async () => {
            await handleRemoveSubject(
                mockSubjectsRemove,
                result.current.listSubjects,
                result.current.setListSubjects,
                setExclusionDialogOpen
            );
        });

        // Verifica se a lista de subjects foi atualizada corretamente (a disciplina 'História' deve ser removida)
        expect(result.current.listSubjects).toEqual([
            {
                _id: '1',
                name: 'Matemática',
                shortName: 'MAT',
                description: 'Disciplina de Matemática',
                user: 'user1',
                journeys: ['journey1'],
                order: 1,
                createdAt: '2024-01-01T12:00:00Z',
                updatedAt: '2024-01-02T12:00:00Z',
                __v: 0,
            },
        ]);

        // Verificando se o setExclusionDialogOpen foi chamado com o valor correto
        expect(setExclusionDialogOpen).toHaveBeenCalledWith(false);

        // Verificando se a mensagem de sucesso foi chamada corretamente
        expect(toast.success).toHaveBeenCalledWith("Disciplina excluída com sucesso!");
    });
    it("Deve excluir a disciplina se solicitado", async () => {
        // Simulando a resposta de erro do deleteSubjects (sem a propriedade 'data' ou com erro na resposta)
        (deleteSubjects as jest.Mock).mockResolvedValue({}); // Resposta sem a propriedade 'data'

        const { result } = renderHook(() => {
            const [listSubjects, setListSubjects] = useState(mockSubjects);
            return { listSubjects, setListSubjects };
        });

        const setExclusionDialogOpen = jest.fn();

        await act(async () => {
            await handleRemoveSubject(
                mockSubjectsRemove,
                result.current.listSubjects,
                result.current.setListSubjects,
                setExclusionDialogOpen
            );
        });

        // Aqui o teste vai falhar, pois a resposta não contém a propriedade 'data'
        // Verificando se a lista de subjects não foi modificada (a disciplina 'História' não foi removida)
        expect(result.current.listSubjects).toEqual(mockSubjects);  // Espera que a lista original não tenha mudado

        // Verificando se o setExclusionDialogOpen não foi chamado com o valor correto
        expect(setExclusionDialogOpen).not.toHaveBeenCalled();

        // Verificando se a mensagem de erro foi chamada corretamente
        expect(toast.error).toHaveBeenCalledWith('Erro ao excluir disciplina. Tente novamente mais tarde!');
    });


});