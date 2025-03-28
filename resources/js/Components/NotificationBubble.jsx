import React, { useEffect, useState } from 'react';

export default function NotificationBubble({ notification, onClose }) {
    const [isVisible, setIsVisible] = useState(true);
    
    useEffect(() => {
        // Auto-cerrar después de 5 segundos
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onClose(), 500);
        }, 5000);
        
        return () => clearTimeout(timer);
    }, []);
    
    return (
        <div className={`notification-bubble ${isVisible ? 'show' : 'fade-out'}`}>
            <div className="notification-header">
                <strong>{notification.sender_name}</strong>
                <span className="notification-time">{notification.time}</span>
                <button 
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(() => onClose(), 500);
                    }}
                    className="notification-close"
                >
                    &times;
                </button>
            </div>
            <div className="notification-body">
                {notification.message}
            </div>
        </div>
    );
}