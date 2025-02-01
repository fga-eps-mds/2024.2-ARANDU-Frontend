import { act, render, renderHook, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import SubjectPage from '@/app/subjects/[...pointId]/page';
import { deleteSubjects, GetSubjects, GetSubjectsByUserId } from '@/services/studioMaker.service';
import { toast } from 'sonner';
import { fetchSubjects, handleMenuOpen, handleRemoveSubject, handleSubjectAction, updateSubject } from '@/app/subjects/[...pointId]/subject.functions';
import { Subject } from '@/lib/interfaces/subjetc.interface';
import { useState } from 'react';

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
        // Mock para simular carregamento, mantendo a promise pendente
        (GetSubjects as jest.Mock).mockReturnValue(new Promise(() => { }));

        render(
            <QueryClientProvider client={queryClient}>
                <SubjectPage params={{ pointId: 'admin' }} />
            </QueryClientProvider>
        );

        // Verificar se o indicador de carregamento (progressbar) está visível
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('deve exibir o indicador de carregamento enquanto os dados são buscados com GetSubjectsByUserId', async () => {
        // Mock para simular carregamento, mantendo a promise pendente
        (GetSubjectsByUserId as jest.Mock).mockReturnValue(new Promise(() => { }));

        render(
            <QueryClientProvider client={queryClient}>
                <SubjectPage params={{ pointId: '12345' }} />
            </QueryClientProvider>
        );

        // Verificar se o indicador de carregamento (progressbar) está visível
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
    it('deve ordenar as disciplinas pela propriedade order e chamar setListSubjects e setFilteredSubjects corretamente', async () => {
        // Mock da função de estado
        const setListSubjects = jest.fn();
        const setFilteredSubjects = jest.fn();

        // Definindo os parâmetros para o teste
        const params = { pointId: 'admin' };

        // Função fetchSubjects simulada dentro do teste

        // Chama a função de fetch e passa os parâmetros corretos
        const subjects = await fetchSubjects(params, setListSubjects, setFilteredSubjects);

        // Espera a ordenação ser feita corretamente
        expect(subjects[0].order).toBe(1); // A disciplina com order 1 deve ser a primeira
        expect(subjects[1].order).toBe(2); // A disciplina com order 2 deve ser a segunda

        // Verifica se as funções de estado foram chamadas corretamente
        expect(setListSubjects).toHaveBeenCalledWith(subjects); // Checa se a lista foi setada corretamente
        expect(setFilteredSubjects).toHaveBeenCalledWith(subjects); // Checa se a lista filtrada foi setada corretamente

        // Verifica o retorno da função
        expect(subjects).toEqual([
            { ...mockSubjects[0], order: 1 },
            { ...mockSubjects[1], order: 2 },
        ]);
    });

});


describe('updateSubject', () => {
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
});

describe('handleSubjectAction', () => {
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

describe('handleRemoveSubject', () => {

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

    it("Deve excluir a disciplina se solicitado com erro", async () => {
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

describe('handleMenuOpen', () => {
    it('deve atualizar o estado anchorEl e selectedSubject ao clicar no botão', () => {
        // Simula os mocks para as funções setAnchorEl e setSelectedSubject
        const setAnchorEl = jest.fn();
        const setSelectedSubject = jest.fn();

        // Cria um subject esperado para o teste
        const subject: Subject = {
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
        };

        // Simula um MouseEvent
        const event = {
            currentTarget: document.createElement('button'), // Cria um botão fictício
        } as React.MouseEvent<HTMLButtonElement>;

        // Chama a função handleMenuOpen diretamente
        act(() => {
            handleMenuOpen(event, subject, setAnchorEl, setSelectedSubject);
        });

        // Verifica se setAnchorEl foi chamado com o valor correto
        expect(setAnchorEl).toHaveBeenCalledWith(event.currentTarget);

        // Verifica se setSelectedSubject foi chamado com o subject correto
        expect(setSelectedSubject).toHaveBeenCalledWith(subject);
    });
});
