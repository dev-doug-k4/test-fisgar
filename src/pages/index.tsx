// @ts-nocheck
import React from 'react'
import dynamic from "next/dynamic";
import type { NextPage } from 'next'
import Head from 'next/head'
import AuthGuard from '../guards/AuthGuard'
// redux
import { logout } from '../redux/slices/session'
import { useDispatch, useSelector } from '../redux/store';
// @mui
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(() => ({
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: { xs: 0, md: 32 },
}));

const MapStyle = styled('div')(() => ({
  width: '100%',
  height: '40rem',
}));

// ----------------------------------------------------------------------

const Home: NextPage = () => {
  const MapWithNoSSR = dynamic(() => import("../components/Map"), {
    ssr: false,
  });

  const dispatch = useDispatch()
  const { address, user } = useSelector((state) => state.session);

  // Função simulando metódo POST 
  const handlePostSelectedArea = (draw: any) => {
    const postSession = {
      method: 'POST',
      data: {
        user,
        address,
        layers: draw
      }
    }
    alert(JSON.stringify(postSession))
  }

  return (
    <AuthGuard>
      {!!address &&
        <>
          <Head>
            <title>Mapa - Test Fisgar</title>
            <meta name="description" content="Mapa interativo" />
            <link rel="icon" href="/favicon.ico" />            
          </Head>
          <Container  >
            <ContentStyle>
              <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Bem vindo(a), {user?.name}</Typography>
                <Button onClick={() => dispatch(logout())}>Sair</Button>
              </Stack>

              <MapStyle >
                <MapWithNoSSR
                onDraw={(x) => handlePostSelectedArea(x)}
                  position={[address?.lat, address?.lng]}
                />
              </MapStyle>
            </ContentStyle>
          </Container>
        </>
      }
    </AuthGuard >
  )
}

export default Home
