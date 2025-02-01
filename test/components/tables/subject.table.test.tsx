import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SubjectTable from '@/components/tables/subject.table';
import { updateSubjectOrder } from '@/services/studioMaker.service';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

jest.mock('@/services/studioMaker.service', () => ({
    updateSubjectOrder: jest.fn(),
}));

describe('SubjectTable', () => {
    const subjects = [
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
    const onMenuClick = jest.fn();
    const onMenuClose = jest.fn();
    const onSubjectAction = jest.fn();

    it('deve renderizar a tabela com os assuntos corretamente', () => {
        render(
            <SubjectTable
                subjects={subjects}
                anchorEl={null}
                onMenuClick={onMenuClick}
                onMenuClose={onMenuClose}
                onSubjectAction={onSubjectAction}
            />
        );

        expect(screen.getByText('Nome')).toBeInTheDocument();
        expect(screen.getByText('Matemática')).toBeInTheDocument();
        expect(screen.getByText('História')).toBeInTheDocument();
    });

    it('deve chamar updateSubjectOrder ao arrastar e soltar um item', async () => {
        render(
            <SubjectTable
                subjects={subjects}
                anchorEl={null}
                onMenuClick={onMenuClick}
                onMenuClose={onMenuClose}
                onSubjectAction={onSubjectAction}
            />
        );

        const firstRow = screen.getByText('Matemática');
        const secondRow = screen.getByText('História');

        fireEvent.dragStart(firstRow);
        fireEvent.dragEnter(secondRow);
        fireEvent.drop(secondRow);
        fireEvent.dragEnd(firstRow);

        await waitFor(() => {
            expect(updateSubjectOrder).toHaveBeenCalledWith([
                subjects[1],
                subjects[0],
            ]);
        });
    });
});
