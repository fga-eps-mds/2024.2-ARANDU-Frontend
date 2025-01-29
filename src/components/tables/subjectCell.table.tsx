import React from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRouter } from 'next/navigation';
import { Subject } from '@/lib/interfaces/subjetc.interface';

interface CellProps {
    anchorEl: null | HTMLElement;
    onMenuClick: (event: React.MouseEvent<HTMLButtonElement>, subject: Subject) => void;
    onMenuClose: () => void;
    onSubjectAction: (action: string) => void;
    subject: Subject;
}

const Cell: React.FC<CellProps> = ({
    anchorEl,
    onMenuClick,
    onMenuClose,
    onSubjectAction,
    subject,
}) => {
    const router = useRouter();

    return (
        <>
            <IconButton
                onClick={(e) => onMenuClick(e, subject)}
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
                        router.push(`/journey/${subject._id}`);
                    }}
                >
                    Gerenciar Jornadas
                </MenuItem>
                <MenuItem onClick={() => onSubjectAction('excluir')}>
                    Excluir
                </MenuItem>
            </Menu>
        </>
    );
};

export default Cell;
