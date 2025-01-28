'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Drawer, IconButton, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from '@mui/icons-material/Close';
import FollowTheSignsIcon from '@mui/icons-material/FollowTheSigns';
import { useEffect, useState } from 'react';

interface SideBarProps {
  handleDrawerOpen: () => void;
  open: boolean;
}

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
}

const sidebarItems: SidebarItem[] = [
  {
    label: 'Home',
    href: '/home',
    icon: <HomeIcon className="h-5 w-5 mr-2" />,
  },
  {
    label: 'Painel de Administrador',
    href: '/admin',
    icon: <DashboardIcon className="h-5 w-5 mr-2" />,
    roles: ['admin'],
  },
  {
    label: 'Disciplinas (Admin)',
    href: `/subjects/admin`,
    icon: <DashboardIcon className="h-5 w-5 mr-2" />,
    roles: ['admin'],
  },
  {
    label: 'Disciplinas',
    href: `/subjects/{id}`,
    icon: <DashboardIcon className="h-5 w-5 mr-2" />,
    roles: ['aluno'],
  },
  {
    label: 'Meus Pontos de Partida',
    href: '/starting-points',
    icon: <FollowTheSignsIcon className="h-5 w-5 mr-2" />,
    roles: ['professor', 'admin'],
  },
];

const Sidebar: React.FC<SideBarProps> = ({ handleDrawerOpen, open }) => {
  const { data: session } = useSession();
  const [userId, setUserId] = useState<string | null>(null);

  // Carrega o ID do usuário do localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem('id');
      setUserId(id ? id.replace(/"/g, '') : null); // Remove as aspas da string
    }
  }, []);

  return (
    <Drawer anchor="left" open={open} onClose={handleDrawerOpen}>
      <Box sx={{ width: 250 }}>
        <IconButton onClick={handleDrawerOpen}>
          <CloseIcon />
        </IconButton>
        <ul>
          {sidebarItems
            .filter((item) =>
              session && item.roles
                ? item.roles.includes(session.user.role)
                : true,
            )
            .map((item) => {
              const href = item.href.replace('{id}', userId || '');
              return (
                <li
                  key={href}
                  className="mb-2 flex items-center p-2 hover:bg-blue-100 hover:text-purple-600 transition duration-200"
                >
                  {item.icon}
                  <Link
                    href={href}
                    className="block p-2 hover:bg-blue-100 hover:text-purple-600 transition duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
        </ul>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
