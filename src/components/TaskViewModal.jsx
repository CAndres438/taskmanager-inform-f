import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Button, Chip, Box
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const STATUS_COLORS = {
  PENDING: 'warning',
  IN_PROGRESS: 'info',
  COMPLETED: 'success'
};

const TaskViewModal = ({ task, open, onClose }) => {
  const { t } = useTranslation();

  if (!task) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{t('task.details')}</DialogTitle>
      <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{task.title}</Typography>
          <Chip label={t('task.' + task.status.toLowerCase())} color={STATUS_COLORS[task.status]} />
        </Box>

        <Typography variant="subtitle2" color="text.secondary">
          {t('task.description')}:
        </Typography>
        <Typography variant="body1">{task.description || '-'}</Typography>

        <Typography variant="subtitle2" color="text.secondary">
          {t('task.created_at')}: {new Date(task.createdAt).toLocaleDateString()}
        </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {t('task.assigned_to')}: {task.assignedUserName}
          </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{t('task.close')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskViewModal;