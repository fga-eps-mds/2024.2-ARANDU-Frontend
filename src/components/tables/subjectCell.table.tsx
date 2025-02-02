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
                aria-label="menu-options"
                onClick={(e) => onMenuClick(e, subject)}
                color="primary"
                title="more"
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={onMenuClose}
                title="Menu"
            >
                <MenuItem
                    onClick={() => onSubjectAction('editar')}
                    aria-label="Editar Assunto"
                >
                    Editar Assunto
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        router.push(`/journey/${subject._id}`);
                    }}
                    aria-label="Gerenciar_Jornadas"
                >
                    Gerenciar Jornadas
                </MenuItem>
                <MenuItem
                    onClick={() => onSubjectAction('excluir')}
                    title="Excluir"
                    aria-label="Excluir Assunto"
                >
                    Excluir
                </MenuItem>
            </Menu>
        </>
    );

};

export default Cell;
