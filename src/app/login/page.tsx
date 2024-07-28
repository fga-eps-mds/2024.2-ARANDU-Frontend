import { Box, IconButton, Link, Typography } from '@mui/material';
import googleIcon from '@/public/googleIcon.svg';
import Image from 'next/image';
import { SingInForm } from '../components/forms/signInForm';
import { Apple } from '@mui/icons-material';
import maoCerebro from '@/public/mao_cerebro.png';
import microsoftIcon from '../../public/microsoftIcon.svg';
import { SingUpForm } from '../components/forms/signupForm';
import { GoogleAuthButton } from '../components/buttons/authButtons';

export default async function SignInPage() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      padding={2}
      bgcolor="#fffafa"
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        maxWidth="800px"
        padding={2}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flex={1}
          sx={{ marginRight: 15 }}
        >
          <Image
            src={maoCerebro}
            alt="Imagem Sign Up"
            width={500}
            height={500}
          />
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center" flex={1}>
          <Typography variant="h5" gutterBottom align="center">
            Cadastre-se gratuitamente e descubra sua jornada de aprendizado.
          </Typography>
          <Box display="flex" gap={1} mb={2}>
            <GoogleAuthButton />
            <IconButton size="large" color="inherit">
              <Image
                src={microsoftIcon}
                alt="Microsoft Icon"
                width={20}
                height={20}
              />
            </IconButton>
            <IconButton size="large" color="inherit">
              <Apple />
            </IconButton>
          </Box>
          <SingInForm />
          <Link href="/signup" underline="hover" color="inherit" sx={{ mt: 2 }}>
            <Typography variant="body2">Novo Usuário? Cadastre-se</Typography>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
