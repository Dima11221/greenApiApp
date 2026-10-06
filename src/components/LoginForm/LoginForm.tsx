import {useState} from "react";
import type {Credentials} from "../../types/types.ts";
import * as React from "react";
import {GetStateInstance} from "../../api/api.ts";
import styles from "../LoginForm/style.module.scss"
import {Planet} from "../../icons/Planet.tsx";
import {About} from "../../icons/About.tsx";
import {Check} from "../../icons/Check.tsx";

interface ILoginFormProps {
  onLogin: (credentials: Credentials) => void;
}

const LoginForm = ({onLogin}: ILoginFormProps) => {

  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const credentials: Credentials = {
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim()
    };
    try {
      const data = await GetStateInstance(credentials);
      if (data.stateInstance !== 'authorized') {
        setError(`Инстанс не авторизован (Статус: ${data.stateInstance})`);
        return;
      }
      onLogin(credentials);
    }  catch (e) {
      console.error(e);
      setError('Ошибка при проверке авторизации. Проверьте правильность введенных данных');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.main}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div>
          <button type="button" className={`${styles.iconBtn} ${styles.left}`} aria-label="Язык">
            <Planet />
          </button>
          <button type="button" className={`${styles.iconBtn} ${styles.right}`} aria-label="Язык">
            <About />
          </button>
        </div>
        <div className={styles.fields}>
          <input
            className={styles.input}
            type="text"
            placeholder="idInstance"
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value)}
            required
          />
          <input
            className={styles.input}
            type="text"
            placeholder="apiTokenInstance"
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={styles.submit}
          >
            <Check />
          </button>
        </div>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;