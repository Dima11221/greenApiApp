import { useState } from 'react';
import './App.css';
import type {Credentials} from "./types/types.ts";
import Chat from "./components/Chat/Chat.tsx";
import LoginForm from "./components/LoginForm/LoginForm.tsx";


function App() {
  const [credentials, setCredentials] = useState<Credentials | null>(null);

  if (!credentials) return <LoginForm onLogin={setCredentials} />

  return (
    <div>
      <Chat credentials={credentials} />
    </div>
  )
}

export default App
