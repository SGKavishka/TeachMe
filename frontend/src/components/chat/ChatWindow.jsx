import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { api } from "../../api/axios.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNotifications } from "../../context/NotificationContext.jsx";
import { Button } from "../common/Button.jsx";

const sampleContacts = [
  { id: "sample-teacher", name: "Ariana Miller", role: "teacher", last: "Available after 5 PM today" },
  { id: "sample-student", name: "Jordan Lee", role: "student", last: "Can we review calculus limits?" }
];

export const ChatWindow = () => {
  const { user } = useAuth();
  const { socket } = useNotifications();
  const [contacts] = useState(sampleContacts);
  const [active, setActive] = useState(sampleContacts[0]);
  const [messages, setMessages] = useState([
    { _id: "1", sender: { _id: "sample-teacher", name: "Ariana Miller" }, body: "Send your topic and preferred time.", createdAt: new Date().toISOString() },
    { _id: "2", sender: { _id: user?.id || user?._id, name: user?.name }, body: "I need help with integration by parts.", createdAt: new Date().toISOString() }
  ]);
  const [body, setBody] = useState("");

  useEffect(() => {
    if (!socket) return undefined;

    const onMessage = (message) => setMessages((items) => [...items, message]);
    socket.on("message:new", onMessage);
    return () => socket.off("message:new", onMessage);
  }, [socket]);

  useEffect(() => {
    if (!active?.userId) return;
    api.get(`/messages/${active.userId}`)
      .then(({ data }) => setMessages(data.data || []))
      .catch(() => {});
  }, [active]);

  const send = async (event) => {
    event.preventDefault();
    if (!body.trim()) return;

    const optimistic = {
      _id: crypto.randomUUID(),
      sender: { _id: user?.id || user?._id, name: user?.name },
      receiver: active.userId || active.id,
      body,
      createdAt: new Date().toISOString()
    };
    setMessages((items) => [...items, optimistic]);
    setBody("");

    if (active.userId) {
      socket?.emit("message:send", { receiver: active.userId, body });
      await api.post("/messages", { receiver: active.userId, body }).catch(() => {});
    }
  };

  return (
    <div className="grid min-h-[620px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[300px_1fr]">
      <aside className="border-b border-slate-200 dark:border-slate-800 lg:border-b-0 lg:border-r">
        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
          <h2 className="font-bold text-slate-950 dark:text-white">Messages</h2>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              type="button"
              onClick={() => setActive(contact)}
              className={`w-full px-4 py-4 text-left transition ${active.id === contact.id ? "bg-brand-50 dark:bg-brand-500/10" : "hover:bg-slate-50 dark:hover:bg-slate-800"}`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-200 font-bold text-slate-700 dark:bg-slate-700 dark:text-white">
                  {contact.name.slice(0, 1)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-slate-950 dark:text-white">{contact.name}</span>
                  <span className="block truncate text-sm text-slate-500 dark:text-slate-400">{contact.last}</span>
                </span>
              </div>
            </button>
          ))}
        </div>
      </aside>

      <section className="flex min-h-[620px] flex-col">
        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
          <p className="font-bold text-slate-950 dark:text-white">{active.name}</p>
          <p className="text-sm capitalize text-slate-500 dark:text-slate-400">{active.role}</p>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4 dark:bg-slate-950">
          {messages.map((message) => {
            const mine = String(message.sender?._id || message.sender) === String(user?.id || user?._id);
            return (
              <div key={message._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[78%] rounded-lg px-4 py-3 text-sm shadow-sm ${mine ? "bg-brand-600 text-white" : "bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-100"}`}>
                  {message.body}
                </div>
              </div>
            );
          })}
        </div>
        <form onSubmit={send} className="flex gap-3 border-t border-slate-200 p-4 dark:border-slate-800">
          <input
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Write a message"
            className="focus-ring min-h-11 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
          <Button type="submit">
            <Send className="h-4 w-4" />
            Send
          </Button>
        </form>
      </section>
    </div>
  );
};

