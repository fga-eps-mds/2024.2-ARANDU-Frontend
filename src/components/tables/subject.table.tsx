import React, { useMemo, useState, useEffect } from 'react';
import {
    useMaterialReactTable,
    type MRT_ColumnDef,
    MRT_TableContainer as MrtTableContainer,
    MRT_Row,
} from 'material-react-table';
import { useRouter } from 'next/navigation';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Menu, MenuItem, IconButton } from '@mui/material';
import { Subject } from '@/lib/interfaces/subjetc.interface';
import { toast } from 'sonner';
import { updateSubjectOrder } from '@/services/studioMaker.service';

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
                accessorKey: 'title',
                header: 'Nome',
            },

            {
                accessorKey: 'actions',
                header: '',
                enableColumnFilter: false,
                Cell: ({ row }: { row: { original: Subject } }) => (
                    <>
                        <IconButton
                            onClick={(e) => {
                                onMenuClick(e, row.original);
                                setSelectedSubject(row.original);
                            }}
                            color="primary"
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={onMenuClose}
                        >
                            <MenuItem onClick={() => onSubjectAction('editar')}>
                                Editar Assunto
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    if (selectedSubject) {
                                        router.push(`/trail/${selectedSubject._id}`);
                                    }
                                }}
                            >
                                Gerenciar trilhas
                            </MenuItem>
                            <MenuItem onClick={() => onSubjectAction('excluir')}>
                                Excluir
                            </MenuItem>
                        </Menu>
                    </>
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
        muiRowDragHandleProps: ({ table }) => ({
            onDragEnd: async (): Promise<void> => {
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
            },
        }),
    });


    return <MrtTableContainer table={table} />;
};

export default SubjectTable;
