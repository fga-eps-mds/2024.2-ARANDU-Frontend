import React, { useMemo, useState, useEffect } from 'react';
import {
    useMaterialReactTable,
    type MRT_ColumnDef,
    MRT_TableContainer as MrtTableContainer,
    MRT_Row,
} from 'material-react-table';
import { useRouter } from 'next/navigation';
import { Subject } from '@/lib/interfaces/subjetc.interface';
import { updateSubjectOrder } from '@/services/studioMaker.service';
import Cell from "@/components/tables/subjectCell.table";

interface SubjectTableProps {
    subjects: Subject[];
    anchorEl: null | HTMLElement;
    onMenuClick: (
        event: React.MouseEvent<HTMLButtonElement>,
        subject: Subject,
    ) => void;
    onMenuClose: () => void;
    onSubjectAction: (action: string) => void;
}

const SubjectTable: React.FC<SubjectTableProps> = ({
    subjects,
    anchorEl,
    onMenuClick,
    onMenuClose,
    onSubjectAction,
}) => {
    const router = useRouter();
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [data, setData] = useState<Subject[]>(subjects);

    useEffect(() => {
        setData(subjects);
    }, [subjects]);

    const columns = useMemo<MRT_ColumnDef<Subject>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Nome',
            },

            {
                accessorKey: 'actions',
                header: '',
                enableColumnFilter: false,
                Cell: ({ row }: { row: { original: Subject } }) => (
                    <Cell
                        anchorEl={anchorEl}
                        onMenuClick={onMenuClick}
                        onMenuClose={onMenuClose}
                        onSubjectAction={onSubjectAction}
                        subject={row.original}
                    />
                ),
            },
        ],
        [
            anchorEl,
            onSubjectAction,
            onMenuClick,
            onMenuClose,
            router,
            selectedSubject,
        ],
    );

    const table = useMaterialReactTable({
        columns,
        data,
        enableRowOrdering: true,
        enablePagination: false,
        muiRowDragHandleProps: ({ table }) => ({
            onDragEnd: (): void => {
                void (async () => {
                    const { draggingRow, hoveredRow } = table.getState();
                    if (hoveredRow && draggingRow) {
                        const newData = [...data];
                        newData.splice(
                            (hoveredRow as MRT_Row<Subject>).index,
                            0,
                            newData.splice(draggingRow.index, 1)[0],
                        );
                        setData(newData);
                        await updateSubjectOrder(newData);
                    }
                })();
            },
        }),
    });



    return <MrtTableContainer table={table}
        role="table" />;
};

export default SubjectTable;
