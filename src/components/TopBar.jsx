import { AppBar, Toolbar, Typography, Box, Select, MenuItem, Button, Avatar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getUserName } from '../utils/auth';
import NotificationBell from './NotificationBell';


const TopBar = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const username = getUserName();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const getInitial = (name) => name ? name.charAt(0).toUpperCase() : '?';

    return (
        <AppBar position="static" color="primary">
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography variant="h6">{t('topbar.title')}</Typography>

                <Box display="flex" alignItems="center" gap={2}>
                    {isAuthenticated() && (
                        <>
                            <NotificationBell />
                            ...
                        </>
                    )}

                    <Typography variant="body2">{t('topbar.language')}</Typography>
                    <Select
                        value={i18n.language}
                        onChange={(e) => i18n.changeLanguage(e.target.value)}
                        size="small"
                        sx={{ color: 'white', borderColor: 'white' }}
                    >
                        <MenuItem value="es">{t('topbar.lang_es')}</MenuItem>
                        <MenuItem value="en">{t('topbar.lang_en')}</MenuItem>
                        <MenuItem value="fr">{t('topbar.lang_fr')}</MenuItem>
                    </Select>

                    {isAuthenticated() && (
                        <>
                            <Avatar
                                sx={{ bgcolor: '#ffffff22', width: 32, height: 32, fontSize: '0.9rem' }}
                            >
                                {getInitial(username)}
                            </Avatar>
                            <Typography variant="body2">
                                {t('topbar.welcome')}, <strong>{username}</strong>
                            </Typography>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleLogout}
                                size="small"
                            >
                                {t('topbar.logout')}
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;
