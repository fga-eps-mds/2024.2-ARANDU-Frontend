import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import SubjectPage from '@/app/subjects/[...pointId]/page';
import { GetSubjects, GetSubjectsByUserId } from '@/services/studioMaker.service';
import { toast } from 'sonner';
import { useState } from 'react';
import { subjectSchema } from '@/lib/schemas/subjects.schema';
import { Subject } from '@/lib/interfaces/subjetc.interface';
import { addSubject, updateSubject } from '@/app/subjects/[...pointId]/subject.functions';
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