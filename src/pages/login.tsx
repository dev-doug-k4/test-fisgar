import React from 'react';
import type { NextPage } from 'next'
import Head from 'next/head'
import { useFormik } from 'formik';
import * as yup from 'yup';
import GuestGuard from '../guards/GuestGuard';
// redux
import { login } from '../redux/slices/session'
import { useDispatch, useSelector } from '../redux/store';
// @mui
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
// utils
import checkCPF from '../utils/checkCPF';
// components
import PlaceInput from '../components/PlaceInput';

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: 16,
}));

// ----------------------------------------------------------------------

const validationSchema = yup.object({
  name: yup.string().required('Informe seu nome'),
  cpf: yup
    .string()
    .required('Informe seu CPF')
    .transform((value: string) => value.replace(/\D/g, ''))
    // @ts-ignore
    .test('', 'CPF inválido', (value: string) => checkCPF(value)),
  email: yup
    .string()
    .email('E-mail inválido')
    .required('Informe seu e-mail'),

  address: yup.string().required('Informe a localização'),
});

const Login: NextPage = () => {
  const dispatch = useDispatch()
  const { address } = useSelector((state) => state.session);

  const initialValues = {
    name: '',
    cpf: '',
    email: '',
    address: address?.description || '',
  }

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // @ts-ignore
      delete values.address
      dispatch(login(values))
      // alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <GuestGuard >
      <Head>
        <title>Login - Teste Fisgar</title>
        <meta name="description" content="Formulário de acesso" />
        <link rel="icon" href="/favicon.ico" />       
      </Head>

      <Container maxWidth="sm" >
        <ContentStyle>
          <form onSubmit={formik.handleSubmit}>
            <Stack sx={{ margin: 'auto' }} spacing={2}>

              {/* (cidade, estado, rua, bairro e CEP) */}
              <PlaceInput
                fieldProps={{
                  id: "address",
                  name: "address",
                  label: "Localizção",
                  value: formik.values.address,
                  error: formik.touched.address && Boolean(formik.errors.address),
                  helperText: formik.touched.address && formik.errors.address,
                }}
                // @ts-ignore
                onChange={formik.handleChange}
              />

              {/* (nome, CPF e e-mail) */}
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Nome"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                fullWidth
                id="cpf"
                name="cpf"
                label="CPF"
                value={formik.values.cpf}
                onChange={formik.handleChange}
                error={formik.touched.cpf && Boolean(formik.errors.cpf)}
                helperText={formik.touched.cpf && formik.errors.cpf}
              />

              <Button color="primary" variant="contained" fullWidth type="submit">
                Entrar
              </Button>
            </Stack>
          </form>
        </ContentStyle>
      </Container>

    </GuestGuard>
  )
}

export default Login
