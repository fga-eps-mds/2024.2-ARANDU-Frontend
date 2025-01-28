'use client';

import React from 'react';
import { Typography } from '@mui/material';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { amarante } from '../fonts/fonts';

const CalculusHeader: React.FC = () => {
  const { data: session } = useSession();
  return (
    <Typography
      variant="h4"
      component="div"
      sx={{ flexGrow: 1, color: 'black', fontWeight: 'bold' }}
    >
      <Link href={session ? '/home' : '/'} className={`${amarante.className}`}>ARANDU</Link>
    </Typography>
  );
};

export default CalculusHeader;
