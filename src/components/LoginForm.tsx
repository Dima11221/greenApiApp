import {useState} from "react";
import type {Credentials} from "../types/types.ts";
import * as React from "react";
import {handeGetStateInstance} from "../api/api.ts";

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
      const data = await handeGetStateInstance(credentials);
      console.log(data);
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
    <div>
      <div>
        <div>
          <h1>Проверка авторизации</h1>
          <div>
            {/*<img src=''>Иконка планеты</img>*/}
            <span>Иконка планеты</span>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="idInstance"
                value={idInstance}
                onChange={(e) => setIdInstance(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="apiTokenInstance"
                value={apiTokenInstance}
                onChange={(e) => setApiTokenInstance(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>{loading ? 'Загрузка...' : 'Проверить'}</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;