import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/axios.js";
import { useAuth } from "./AuthContext.jsx";
import { useSocket } from "../hooks/useSocket.js";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const socket = useSocket(token);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }

    api.get("/notifications")
      .then(({ data }) => setNotifications(data.data || []))
      .catch(() => setNotifications([]));
  }, [isAuthenticated]);

  useEffect(() => {
    if (!socket) return undefined;

    const onNotification = (notification) => {
      setNotifications((items) => [notification, ...items]);
    };

    socket.on("notification:new", onNotification);
    return () => socket.off("notification:new", onNotification);
  }, [socket]);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const value = useMemo(() => ({ notifications, unreadCount, socket }), [notifications, unreadCount, socket]);
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => useContext(NotificationContext);

