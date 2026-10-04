
import type {ChatHistory, ChatMessage, Credentials} from "../types/types.ts";
import {useEffect, useState} from "react";
import {GetChatHistory, SendMessage} from "../api/api.ts";

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
        console.log('data', data);
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
      console.log(data);
    } catch (e) {
      console.error(e);
      setError('Не удалось отправить сообщение')
    }
  };

  return (
    <div>
      <h1>ЧАТ</h1>

      <div>
        {loading && <p>Загрузка...</p>}
        {!loading && messages.length === 0 && <p>Нет сообщений</p>}
        {messages.map((message) => (
          <div key={message.id}>
            <p>{message.own ? 'Я' : message.contactName}</p>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      {error && <p>{error}</p>}

      <section>
        <div>
          <h1>Окно отправки сообщения</h1>
          <form onSubmit={handleSubmitMessage}>
            <p>
              <label htmlFor="text">Введите текст сообщения</label>
              <input
                type="text"
                name="text"
                id="text"
                value={message}
                placeholder="Привет"
                required
                onChange={(e) => setMessage(e.target.value)}
              />
            </p>
            <button type="submit">Отправить сообщение</button>
          </form>
        </div>
      </section>
    </div>
  )
};

export default ChatWindow;
