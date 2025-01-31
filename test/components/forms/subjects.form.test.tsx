import '@testing-library/jest-dom';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { AppRouterContextProviderMock } from '../../context/app-router-context-mock';
import { SubjectForm } from '@/components/forms/subject.form';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createSubject, updateSubjectById } from '@/services/studioMaker.service';
import { toast } from 'sonner';

jest.mock('next-auth/react', () => ({
    useSession: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
    useQuery: jest.fn(),
}));

jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

// Mock da função createSubject e updateSubjectById corretamente
jest.mock('@/services/studioMaker.service', () => ({
    createSubject: jest.fn().mockResolvedValueOnce({ data: { _id: '123', name: 'Novo Assunto', description: 'hellloworld' } }), // Mock da resposta
    updateSubjectById: jest.fn().mockResolvedValueOnce({ data: { _id: '123', name: 'Novo Assunto Atualizado', description: 'helloworld atualizado' } }), // Mock da resposta
}));

describe('Testando a página SubjectForm', () => {
    beforeEach(() => {
        (useSession as jest.Mock).mockReturnValue({ data: { user: { role: ['admin'] } } });
        (useQuery as jest.Mock).mockReturnValue({ data: [], isLoading: false, error: null });
    });

    it('deve renderizar o formulário para criar um assunto', () => {
        render(
            <AppRouterContextProviderMock router={{ push: jest.fn() }}>
                <SubjectForm callback={jest.fn()} subject={null} setDialog={jest.fn()} pointId="1234" />
            </AppRouterContextProviderMock>
        );
        // Verifica se o botão de criação aparece
        expect(screen.getByText('Criar Assunto')).toBeInTheDocument();
    });

    it('deve chamar createSubject ao enviar o formulário para criar um novo assunto', async () => {
        render(
            <AppRouterContextProviderMock router={{ push: jest.fn() }}>
                <SubjectForm callback={jest.fn()} subject={null} setDialog={jest.fn()} pointId="1234" />
            </AppRouterContextProviderMock>
        );

        // Simula preenchimento dos campos
        fireEvent.change(screen.getByLabelText(/Nome da Disciplina/i), { target: { value: 'Novo Assunto' } });
        fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'hellloworld' } });

        // Simula envio do formulário
        fireEvent.click(screen.getByText('Criar Assunto'));

        // Espera que a função createSubject tenha sido chamada
        await waitFor(() => {
            expect(createSubject).toHaveBeenCalledWith({
                data: { pointId: '1234', name: 'Novo Assunto', description: 'hellloworld' },
                token: JSON.parse(localStorage.getItem('token')!), // Verificando o token
            });
        });

        // Verifica se o toast de sucesso foi chamado
        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Assunto criado com sucesso!');
        });
    });

    it('deve chamar updateSubjectById ao enviar o formulário para atualizar um assunto existente', async () => {
        const subject = { _id: '123', name: 'Assunto Existente', description: 'descrição existente' };

        render(
            <AppRouterContextProviderMock router={{ push: jest.fn() }}>
                <SubjectForm callback={jest.fn()} subject={subject} setDialog={jest.fn()} pointId="1234" />
            </AppRouterContextProviderMock>
        );

        // Simula alteração nos campos
        fireEvent.change(screen.getByLabelText(/Nome da Disciplina/i), { target: { value: 'Novo Assunto Atualizado' } });
        fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'helloworld atualizado' } });

        // Simula envio do formulário
        fireEvent.click(screen.getByText('Atualizar Assunto'));

        // Espera que a função updateSubjectById tenha sido chamada
        await waitFor(() => {
            expect(updateSubjectById).toHaveBeenCalledWith({
                id: '123',
                data: { name: 'Novo Assunto Atualizado', description: 'helloworld atualizado' },
                token: JSON.parse(localStorage.getItem('token')!),
            });
        });

        // Verifica se o toast de sucesso foi chamado
        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Assunto atualizado com sucesso!');
        });
    });

});
