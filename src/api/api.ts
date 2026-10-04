import {API_URL} from "../config.ts";
import type {Credentials} from "../types/types.ts";

const BASE_URL = `${API_URL}/waInstance`;

export const handeGetStateInstance = async (c: Credentials) => {
  const response = await fetch(`${BASE_URL}${c.idInstance}/getStateInstance/${c.apiTokenInstance}`, {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
  });
  if (!response.ok) {
    throw new Error(`Ошибка запроса: ${response.status}`);
  }
  const data = await response.json();
  return data;
}


export const handleCheckAccount = async (c: Credentials, phoneNumber: number) => {
  const response = await fetch(`${BASE_URL}${c.idInstance}/checkAccount/${c.apiTokenInstance}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({phoneNumber}),
  });
  if (!response.ok) {
    throw new Error(`Ошибка запроса: ${response.status}`);
  }
  const data = await response.json();
  return data;
};

export const handleSendMessage = async (c: Credentials, chatId: string, message: string) => {
  const responce = await fetch(`${BASE_URL}${c.idInstance}/sendMessage/${c.apiTokenInstance}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({chatId, message}),
  })
  if (!responce.ok) {
    throw new Error(`Ошибка запроса: ${responce.status}`);
  }
  const data = await responce.json();
  return data;
};