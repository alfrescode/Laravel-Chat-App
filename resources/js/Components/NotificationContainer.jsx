import React, { useState, useEffect } from 'react';
import NotificationBubble from './NotificationBubble';

export default function NotificationContainer() {
    const [notifications, setNotifications] = useState([]);
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        // Recuperar notificaciones no leídas
        axios.get(route('notifications.unread'))
            .then(response => {
                setNotifications(response.data);
                setCount(response.data.length);
            });
            
        // Configurar Echo para escuchar nuevas notificaciones
        if (window.Echo) {
            const userId = document.querySelector('meta[name="user-id"]')?.getAttribute('content');
            
            if (userId) {
                window.Echo.private(`user.${userId}`)
                    .notification((notification) => {
                        setNotifications(prev => [...prev, notification]);
                        setCount(count => count + 1);
                    });
            }
        }
        
        return () => {
            // Limpiar suscripciones de Echo
            if (window.Echo) {
                const userId = document.querySelector('meta[name="user-id"]')?.getAttribute('content');
                if (userId) {
                    window.Echo.leave(`user.${userId}`);
                }
            }
        };
    }, []);
    
    const removeNotification = (index) => {
        setNotifications(notifications.filter((_, i) => i !== index));
    };
    
    return (
        <div className="notification-wrapper">
            {count > 0 && (
                <div className="notification-counter">{count}</div>
            )}
            <div className="notification-container">
                {notifications.map((notification, index) => (
                    <NotificationBubble 
                        key={notification.id || index}
                        notification={notification}
                        onClose={() => removeNotification(index)}
                    />
                ))}
            </div>
        </div>
    );
}