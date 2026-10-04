import { useState } from 'react';
import './App.css';
import type {Credentials} from "./types/types.ts";
import Chat from "./components/Chat.tsx";
import LoginForm from "./components/LoginForm.tsx";


function App() {
  const [credentials, setCredentials] = useState<Credentials | null>(null);

  if (!credentials) return <LoginForm onLogin={setCredentials} />

  return (
    <main>
      <Chat credentials={credentials} />
    </main>
  )
}

export default App
