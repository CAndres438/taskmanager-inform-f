import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, Select, InputLabel, FormControl, IconButton, Snackbar, Alert
} from '@mui/material';
import { useEffect, useState, useMemo } from 'react';
import axios from '../api/axiosInstance';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { isAdmin } from '../utils/auth';

const schema = yup.object({
  title: yup.string().required('task.validation_title'),
  assignedUserId: yup.string().required('task.validation_assigned')
});

const TaskFormModal = ({ open, onClose, task, onSuccess }) => {
  const isEdit = Boolean(task);
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      status: 'PENDING',
      assignedUserId: ''
    }
  });

  const watchedValues = watch();

  useEffect(() => {
    if (isAdmin()) {
      axios.get('/api/users')
        .then(res => setUsers(res.data))
        .catch(() => showMessage('task.load_users_error', 'error'));
    }
  }, []);

  useEffect(() => {
    if (task) {
      reset({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'PENDING',
        assignedUserId: task.assignedUserId || ''
      });
    } else {
      reset({
        title: '',
        description: '',
        status: 'PENDING',
        assignedUserId: ''
      });
    }
  }, [task, open, reset]);

  const showMessage = (key, severity = 'success') => {
    setSnackbar({ open: true, message: t(key), severity });
  };

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await axios.put(`/api/tasks/${task.id}`, data);
        onSuccess('task.updated');
      } else {
        await axios.post('/api/tasks', data);
        onSuccess('task.created');
      }
      onClose();
    } catch {
      showMessage('task.save_error', 'error');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {isEdit ? t('task.edit') : t('task.create')}
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t('task.title')}
              error={!!errors.title}
              helperText={errors.title ? t(errors.title.message) : ''}
              required
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t('task.description')}
              multiline
              rows={3}
            />
          )}
        />
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <TextField label={t('task.status')} select {...field}>
              <MenuItem value="PENDING">{t('task.pending')}</MenuItem>
              <MenuItem value="IN_PROGRESS">{t('task.in_progress')}</MenuItem>
              <MenuItem value="COMPLETED">{t('task.completed')}</MenuItem>
            </TextField>
          )}
        />
        {isAdmin() && (
          <FormControl fullWidth required error={!!errors.assignedUserId}>
            <InputLabel>{t('task.assigned_to')}</InputLabel>
            <Controller
              name="assignedUserId"
              control={control}
              render={({ field }) => (
                <Select {...field} label={t('task.assigned_to')}>
                  {users.map((u) => (
                    <MenuItem key={u.id} value={u.id}>{u.name} ({u.email})</MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.assignedUserId && (
              <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>
                {t(errors.assignedUserId.message)}
              </p>
            )}
          </FormControl>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{t('task.cancel')}</Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={isEdit && !isDirty}
        >
          {t('task.save')}
        </Button>
      </DialogActions>

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
    </Dialog>
  );
};

export default TaskFormModal;
