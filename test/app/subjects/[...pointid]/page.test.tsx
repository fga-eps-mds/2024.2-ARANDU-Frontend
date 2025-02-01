import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import SubjectPage from '@/app/subjects/[...pointId]/page';
import { GetSubjects } from '@/services/studioMaker.service';
import { toast } from 'sonner';

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

});