'use client';

import Image from 'next/image';
import googleIcon from '@/public/google.svg';
import { Button } from '@mui/material';
import { authGoogle } from '@/actions/auth.actions';

export function GoogleAuthButton() {

  return (
    <Button className="w-[115px] h-[50px] shadow-[0_6px_0px_0px_rgba(0,0,0,0.1)] bg-[##FFFAFA] border-2  border-[#E0E0E0] rounded-[50px] text-center">
      <Image
        src={googleIcon}
        width={0}
        height={0}
        alt="Google"
        className="w-full h-[25px]"
        onClick={authGoogle}
      />
    </Button>
  );
}
