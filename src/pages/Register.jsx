import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  TextField, Button, Typography, Container, Box, Paper, Snackbar, Alert
} from '@mui/material';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const schema = yup.object({
  name: yup.string().required('register.name_required'),
  email: yup.string().required('register.email_required').email('register.email_invalid'),
  password: yup.string().required('register.password_required')
});

function Register() {
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
      await axios.post('/auth/register', data);
      showMessage('register.success');
      navigate('/login');
    } catch (err) {
      showMessage('register.error', 'error');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" gutterBottom>{t('register.title')}</Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label={t('register.name')}
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name ? t(errors.name.message) : ''}
          />
          <TextField
            label={t('register.email')}
            type="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email ? t(errors.email.message) : ''}
          />
          <TextField
            label={t('register.password')}
            type="password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password ? t(errors.password.message) : ''}
          />
          <Button type="submit" variant="contained" color="primary">
            {t('register.submit')}
          </Button>
          <Button variant="text" onClick={() => navigate('/login')}>
            {t('register.login_link')}
          </Button>

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

export default Register;