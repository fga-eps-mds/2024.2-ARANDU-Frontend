'use client';

import { signOut } from 'next-auth/react';
import MyButton from './myButton.component';

export function SignOutButton() {
  const handleClick = async () => {
    await signOut();
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    window.location.href = '/';
  };
  return (
    <MyButton
      width="6em"
      height="3em"
      color="white"
      type="submit"
      bold
      onClick={handleClick}
    >
      Sair
    </MyButton>
  );
}
