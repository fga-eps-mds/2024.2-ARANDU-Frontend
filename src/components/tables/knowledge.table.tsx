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
import { toast } from 'sonner';
import { Knowledge } from '@/lib/interfaces/knowledge.interface';

interface KnowledgeTableProps {
    knowledge: Knowledge[];
    anchorEl: null | HTMLElement;
    onMenuClick: (
        event: React.MouseEvent<HTMLButtonElement>,
        knowledge: Knowledge,
    ) => void;
    onMenuClose: () => void;
    onKnowledgeAction: (action: string) => void;
}

const KnowledgeTable: React.FC<KnowledgeTableProps> = ({
    knowledge,
    anchorEl,
    onMenuClick,
    onMenuClose,
    onKnowledgeAction,
}) => {
    const router = useRouter();
    const [selectedKnowledge, setSelectedKnowledge] = useState<Knowledge | null>(null);
    const [data, setData] = useState<Knowledge[]>(knowledge);

    useEffect(() => {
        setData(knowledge);
    }, [knowledge]);

    const columns = useMemo<MRT_ColumnDef<Knowledge>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Nome',
            },

            {
                accessorKey: 'actions',
                header: '',
                enableColumnFilter: false,
                Cell: ({ row }: { row: { original: Knowledge } }) => (
                    <>
                        <IconButton
                            onClick={(e) => {
                                onMenuClick(e, row.original);
                                setSelectedKnowledge(row.original);
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
                            <MenuItem onClick={() => onKnowledgeAction('editar')}>
                                Editar Área do Conhecimento
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    if (selectedKnowledge) {
                                        router.push(`/subjects/${selectedKnowledge._id}`);
                                    }
                                }}
                            >
                                Gerenciar Disciplinas
                            </MenuItem>
                            <MenuItem onClick={() => onKnowledgeAction('excluir')}>
                                Excluir
                            </MenuItem>
                        </Menu>
                    </>
                ),
            },
        ],
        [
            anchorEl,
            onKnowledgeAction,
            onMenuClick,
            onMenuClose,
            router,
            selectedKnowledge,
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
                        (hoveredRow as MRT_Row<Knowledge>).index,
                        0,
                        newData.splice(draggingRow.index, 1)[0],
                    );
                    setData(newData);
                    await updateKnowledgeOrder(newData);
                }
            },
        }),
    });

    const updateKnowledgeOrder = async (updatedKnowledges: Knowledge[]) => {
        updatedKnowledges.forEach((knowledge, index) => {
            knowledge.order = index;
        });
        const response = await updateKnowledgesOrder(updatedKnowledges);
        if (response.error) {
            toast.error('Error ao atualizar order da trilha');
            return;
        }
        toast.success('Order da trilha atualizada com sucesso');
    };

    return <MrtTableContainer table={table} />;
};

export default KnowledgeTable;
