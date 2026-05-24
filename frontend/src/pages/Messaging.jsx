import { DashboardLayout } from "../components/layout/DashboardLayout.jsx";
import { ChatWindow } from "../components/chat/ChatWindow.jsx";

export const Messaging = () => {
  return (
    <DashboardLayout title="Messaging" subtitle="Student and tutor conversations with real-time Socket.io updates.">
      <ChatWindow />
    </DashboardLayout>
  );
};

