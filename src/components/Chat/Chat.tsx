import {useState} from "react";
import * as React from "react";
import {CheckAccount} from "../../api/api.ts";
import type {Credentials} from "../../types/types.ts";
import ChatWindow from "../ChatWindow/ChatWindow.tsx";
import styles from "../Chat/style.module.scss"
import {Check} from "../../icons/Check.tsx";


interface IChatProps {
  credentials: Credentials;
}

const normalizePhone = (value: string) => {
  return value.replace(/\D/g, '');
};

const validatePhone = (value: string): string | null => {
  if (!value) return 'Введите номер телефона';
  if (value.startsWith('0')) return 'Номер должен начинаться с кода страны';
  if (value.length < 11 ) return 'Длина номер должна быть 11 цифр';
  return null
}

const Chat = ({credentials}: IChatProps) => {
  const [phone, setPhone] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string>('');

  const handleSubmitNumber = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResult(null);
    setChatId('');
    setError(null);

    const value = normalizePhone(phone);
    const validateError = validatePhone(value);
    if (validateError) {
      setError(validateError);
      return;
    }
    setLoading(true);
    try {

      //!!!
      // const data = await CheckAccount(credentials, Number(value));
      // setResult(data?.exist ? "Номер есть в MAX" : "Номера нет в MAX");
      // setChatId(data?.chatId || '');

      setChatId('220726370');


      setLoading(false);
    } catch (e) {
      console.error(e);
      setError('Ошибка при запросе');
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <section className={styles.main}>
        <form onSubmit={handleSubmitNumber} className={styles.formContainer}>
          <div className={styles.flex}>
            <label htmlFor="phone">Найти</label>
            <input
              className={styles.input}
              type="tel"
              id="phone"
              name="phone"
              required
              placeholder="Номер телефона контакта"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button type="submit" disabled={loading} className={styles.submit}>
              <Check />
            </button>
          </div>
        </form>
        {error && <p className={styles.error}>{error}</p>}
        {result && <p>{result}</p>}

        {chatId && <ChatWindow chatId={chatId} credentials={credentials} />}

      </section>
    </>
  )
};

export default Chat;