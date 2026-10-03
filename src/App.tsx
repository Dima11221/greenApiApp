import { useState } from 'react';
import './App.css';
import {handleCheckAccount, handleSendMessage} from "./api/api.ts";
import * as React from "react";

const normalizePhone = (value: string) => {
  return value.replace(/\D/g, '');
};

const validatePhone = (value: string): string | null => {
  if (!value) return 'Введите номер телефона';
  if (value.startsWith('0')) return 'Номер должен начинаться с кода страны';
  if (value.length < 11 ) return 'Длина номер должна быть 11 цифр';
  return null
}

function App() {
  const [phone, setPhone] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [messageResult, setMessageResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [chatId, setChatId] = useState<string>('');

  const handleSubmitNumber = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResult(null);

    const value = normalizePhone(phone);
    const validateError = validatePhone(value);
    if (validateError) {
      setError(validateError);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const data = await handleCheckAccount(Number(phone));
      setResult(data?.exist ? "Номер есть в MAX" : "Номера нет в MAX");
      console.log(data);
      setChatId(data?.chatId || '');
      setLoading(false);
    } catch (e) {
      console.error(e);
      setError('Ошибка при запросе');
      setLoading(false);
    }
  };

  const handleSubmitMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await handleSendMessage(chatId, message);
      setMessageResult(data?.idMessage ? 'Сообщение отправлено' : 'Ошибка при отправке сообщения');
      setMessage('');
      console.log(data);
    } catch (e) {
      console.error(e);
      setError('Ошибка при отправке сообщения');
    }
  };

  return (
    <>
      <section>
        <div>
          <h1>Узнать, есть ли номер в MAX</h1>
          <form onSubmit={handleSubmitNumber}>
            <p>
              <label htmlFor="phone">Введите номер телефона</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                placeholder="79991234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </p>
            <button type="submit" disabled={loading}>
              {loading ? "Проверка..." : "Проверить"}
            </button>
          </form>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {result && <p>{result}</p>}
        {
          result && (
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
              {messageResult && <p>{messageResult}</p>}
            </section>
          )
        }
      </section>
    </>
  )
}

export default App
