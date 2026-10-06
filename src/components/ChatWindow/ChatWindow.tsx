import type {ChatHistory, ChatMessage, Credentials} from "../../types/types.ts";
import {useEffect, useState} from "react";
import {DeleteNotification, GetChatHistory, ReceiveNotification, SendMessage} from "../../api/api.ts";
import styles from "./../ChatWindow/style.module.scss"
import {Check} from "../../icons/Check.tsx";

interface IChatWindowProps {
  chatId: string;
  credentials: Credentials;
}

const mapChatHistory = (data: ChatHistory[]): ChatMessage[] => {
  return data.map((i) => ({
    id: i.idMessage,
    contactName: i.senderContactName,
    chatId: i.chatId,
    text: i.textMessage || i.extendedTextMessage?.text || '',
    own: i.type === 'outgoing',
    timestamp: i.timestamp
  }))
    .filter((i) => i.text)
    .sort((a, b) => a.timestamp - b.timestamp)
}

const formatTime = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleTimeString('ru-RU',
    {
      hour: '2-digit',
      minute: '2-digit'
    });
}

const INCOMING_TYPES = [
  'incomingMessageReceived',
  'outgoingMessageReceived',
  'outgoingAPIMessageReceived',
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// const appendUnique = (prev: ChatMessage[], newMessage: ChatMessage): ChatMessage[] => {
//   return prev.some((i) => i.id === newMessage.id) ? prev : [...prev, newMessage];
// }

const ChatWindow = ({chatId, credentials}: IChatWindowProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    let canceled = false;
    setMessages([]);
    setLoading(true);
    setError(null);

    GetChatHistory(credentials, chatId)
      .then((data) => {
        if (!canceled) setMessages(mapChatHistory(data));
      })
      .catch((e) => {
        console.error(e);
        if (!canceled) setError('Не удалось загрузить историю чата');
      })
      .finally(() => {
        if (!canceled) setLoading(false)
      });

    return () => {
      canceled = true;
    }
  }, [credentials, chatId]);

  useEffect(() => {
    const controller = new AbortController();
    const {signal} = controller;

    const poll = async () => {
      while (!signal.aborted) {
        try {
          const n = await ReceiveNotification(credentials, signal);
          if (!n) continue;

          await DeleteNotification(credentials, n.receiptId);

          const {body} = n;
          if (!INCOMING_TYPES.includes(body.typeWebhook)) continue;
          if (body.senderData?.chatId !== chatId) continue;

          const text = body.messageData?.textMessageData?.textMessage;
          if (!text || !body.idMessage) continue;

          const msg: ChatMessage = {
            id: body.idMessage,
            chatId,
            text,
            own: body.typeWebhook !== 'incomingMessageReceived',
            contactName: body.senderData?.senderName,
            timestamp: body.timestamp ?? Math.floor(Date.now() / 1000),
          }

          setMessages((prev) => prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]);

        } catch (e) {
          if (signal.aborted) return;
          console.error(e);
          await sleep(2000);
        }
      }
    }

    poll();
    return () => controller.abort();

  }, [credentials, chatId])

  const handleSubmitMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const text = message.trim();
    if (!text) {
      return;
    }
    try {
      const data = await SendMessage(credentials, chatId, text);
      if (!data.idMessage) throw new Error('Не удалось отправить сообщение');
      setMessages((prev) => [
        ...prev,
        {
          id: data.idMessage,
          own: true,
          text,
          chatId,
          timestamp: Math.floor(Date.now() / 1000),
        }]);
      setMessage('');
    } catch (e) {
      console.error(e);
      setError('Не удалось отправить сообщение')
    }
  };

  return (
    <div className={styles.chat}>
      <div className={styles.main}>
        {loading && <p>Загрузка...</p>}
        {!loading && messages.length === 0 && <p>Нет сообщений</p>}
        {messages.map((message) => (
          <div key={message.id} className={`${styles.message} ${message.own ? styles.own : styles.incoming}`}>
            {/*<p>{message.own ? 'Я' : message.contactName}</p>*/}
            <span>{message.text}</span>
            <span className={styles.time}>
              {formatTime(message.timestamp)}
            </span>
          </div>
        ))}
      </div>
      {error && <p>{error}</p>}

      <form onSubmit={handleSubmitMessage} className={styles.inputBar}>
        <input
          type="text"
          name="text"
          id="text"
          value={message}
          placeholder="Сообщение"
          required
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className={`${styles.submit} ${styles.submitChat}`}>
          <Check />
        </button>
      </form>
    </div>
  )
};

export default ChatWindow;


