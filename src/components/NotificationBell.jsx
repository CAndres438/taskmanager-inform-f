import { useEffect, useState } from 'react';
import { IconButton, Badge, Menu, MenuItem, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useTranslation } from 'react-i18next';

const NotificationBell = () => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const socket = new SockJS(import.meta.env.VITE_WS_URL);
    const stomp = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        stomp.subscribe('/topic/tasks', (message) => {
          const task = JSON.parse(message.body);
          setNotifications((prev) => [...prev, task]);
          playNotificationSound();
        });
      },
    });
    stomp.activate();
    return () => stomp.deactivate();
  }, []);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const clearNotifications = () => setNotifications([]);

  const playNotificationSound = () => {
    if (document.visibilityState === 'visible') {
      const audio = new Audio('./notification-pin.mp3');
      audio.play().catch(() => { });
    }
  };


  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem disabled>
          <Typography variant="subtitle2">{t('notif.title')}</Typography>
        </MenuItem>
        {notifications.length === 0 ? (
          <MenuItem disabled>{t('notif.empty')}</MenuItem>
        ) : (
          notifications.map((task, i) => (
            <MenuItem key={i}>
              {t('notif.new_task')}: {task.title}
            </MenuItem>
          ))
        )}
        {notifications.length > 0 && (
          <MenuItem onClick={clearNotifications} sx={{ color: 'red' }}>
            {t('notif.clear')}
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;