
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Container, Typography, Box, Paper, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from '../api/axiosInstance';

const schema = yup.object({
  email: yup
    .string()
    .required('login.email_required')
    .email('login.email_invalid'),
  password: yup
    .string()
    .required('login.password_required'),
});

function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const showMessage = (key, severity = 'success') => {
    setSnackbar({ open: true, message: t(key), severity });
  };

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('/auth/login', data);
      localStorage.setItem('user', JSON.stringify(res.data));
      showMessage('login.success');
      navigate('/home');
    } catch {
      showMessage('login.error', 'error');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" gutterBottom>{t('login.title')}</Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label={t('login.email')}
            type="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email ? t(errors.email.message) : ''}
          />
          <TextField
            label={t('login.password')}
            type="password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password ? t(errors.password.message) : ''}
          />
          <Button type="submit" variant="contained" color="primary">{t('login.submit')}</Button>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert
              severity={snackbar.severity}
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              sx={{ fontSize: '1.1rem', p: 2 }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;