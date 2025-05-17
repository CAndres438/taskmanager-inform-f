
import { useEffect, useState, useCallback, useMemo } from 'react';
import {
    Grid, Card, CardContent, Typography, Button, Chip,
    Box, TextField, MenuItem, Snackbar, Alert, IconButton
} from '@mui/material';
import axios from '../api/axiosInstance';
import TaskFormModal from '../components/TaskFormModal';
import { useTranslation } from 'react-i18next';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { isAdmin } from '../utils/auth';
import TaskViewModal from '../components/TaskViewModal';
import VisibilityIcon from '@mui/icons-material/Visibility';




const STATUS_COLORS = {
    PENDING: 'warning',
    IN_PROGRESS: 'info',
    COMPLETED: 'success'
};

const Home = () => {
    const { t } = useTranslation();
    const [tasks, setTasks] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [filters, setFilters] = useState({ title: '', description: '', status: '' });
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [viewTask, setViewTask] = useState(null);


    const showMessage = useCallback((key, severity = 'success') => {
        setSnackbar({ open: true, message: t(key), severity });
    }, [t]);

    const fetchTasks = useCallback(async () => {
        try {
            const params = { ...filters, page, size: 12 };
            const res = await axios.get('/api/tasks', { params });
            setTasks(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch {
            showMessage('task.load_error', 'error');
        }
    }, [filters, page, showMessage]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    useEffect(() => {
        const socket = new SockJS(import.meta.env.VITE_WS_URL);
        const stomp = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                stomp.subscribe('/topic/tasks', (message) => {
                    const task = JSON.parse(message.body);
                    // console.log('Task update received:', task);
                    fetchTasks();
                    showMessage('task.new_task', 'info');
                });
            },
        });
        stomp.activate();
        return () => stomp.deactivate();
    }, [fetchTasks, showMessage]);

    const handleOpenModal = (task = null) => {
        setSelectedTask(task);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setSelectedTask(null);
        setOpenModal(false);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(t('task.confirm_delete'));
        if (!confirmed) return;
        try {
            await axios.delete(`/api/tasks/${id}`);
            fetchTasks();
            showMessage('task.deleted');
        } catch {
            showMessage('task.delete_error', 'error');
        }
    };

    const handleSuccess = (msgKey) => {
        fetchTasks();
        showMessage(msgKey);
    };

    const renderFilters = () => (
        <Box display="flex" flexDirection="column" gap={2} mb={2}>
            <Box display="flex" gap={2} flexWrap="wrap">
                <TextField label={t('task.title')} value={filters.title} onChange={(e) => setFilters({ ...filters, title: e.target.value })} />
                <TextField label={t('task.description')} value={filters.description} onChange={(e) => setFilters({ ...filters, description: e.target.value })} />
                <TextField label={t('task.status')} select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} sx={{ minWidth: 150 }}>
                    <MenuItem value="">{t('task.all')}</MenuItem>
                    <MenuItem value="PENDING">{t('task.pending')}</MenuItem>
                    <MenuItem value="IN_PROGRESS">{t('task.in_progress')}</MenuItem>
                    <MenuItem value="COMPLETED">{t('task.completed')}</MenuItem>
                </TextField>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => isAdmin() && handleOpenModal()}
                    sx={{ mt: 1 }}
                    disabled={!isAdmin()}
                    title={!isAdmin() ? t('task.only_admin') : ''}
                >
                    {t('task.create')}
                </Button>

                <Box display="flex" gap={1}>
                    {[...Array(totalPages).keys()].map(p => (
                        <Button key={p} variant={p === page ? 'contained' : 'outlined'} onClick={() => setPage(p)}>
                            {p + 1}
                        </Button>
                    ))}
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box p={3}>
            <Typography variant="h5" gutterBottom>{t('task.my_tasks')}</Typography>
            {renderFilters()}
            <Grid container spacing={3} wrap="wrap">
                {tasks.map((task) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={task.id}>
                        <Card elevation={3} sx={{
                            minWidth: 300,
                            maxWidth: 300,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '100%',
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'scale(1.02)'
                            }
                        }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box display="flex" justifyContent="flex-end">
                                    <IconButton
                                        color="info"
                                        size="small"
                                        onClick={() => setViewTask(task)}
                                        title={t('task.view')}
                                    >
                                        <VisibilityIcon fontSize="small" />
                                    </IconButton>
                                </Box>

                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="h6" sx={{
                                        overflow: 'hidden',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        minHeight: '3.2em'
                                    }}>
                                        {task.title}
                                    </Typography>
                                    <Chip label={t('task.' + task.status.toLowerCase())} color={STATUS_COLORS[task.status]} size="small" />
                                </Box>
                                <Typography variant="body2" sx={{
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    mt: 1,
                                    minHeight: '2.6em'
                                }}>
                                    {task.description}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {t('task.created_at')}: {new Date(task.createdAt).toLocaleDateString()}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    👤 {t('task.assigned_to')}: {task.assignedUserName}
                                </Typography>

                            </CardContent>
                            <Box display="flex" justifyContent="flex-end" gap={1} p={2}>
                                <Button
                                    disabled={!isAdmin()}
                                    title={!isAdmin() ? t('task.only_admin') : ''}
                                    size="small" variant="outlined" color="primary" onClick={() => handleOpenModal(task)}>
                                    {t('task.edit')}
                                </Button>
                                <Button
                                    disabled={!isAdmin()}
                                    title={!isAdmin() ? t('task.only_admin') : ''}
                                    size="small" variant="outlined" color="error" onClick={() => handleDelete(task.id)}>
                                    {t('task.delete')}
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <TaskFormModal
                open={openModal}
                onClose={handleCloseModal}
                task={selectedTask}
                onSuccess={handleSuccess}
            />

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

            <TaskViewModal
                open={!!viewTask}
                task={viewTask}
                onClose={() => setViewTask(null)}
            />

        </Box>
    );
}
export default Home;