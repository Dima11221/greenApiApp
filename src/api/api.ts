import {API_URL} from "../config.ts";
import type {ChatHistory, Credentials, ReceiveNotificationItem} from "../types/types.ts";

const BASE_URL = `${API_URL}/waInstance`;

export const GetStateInstance = async (c: Credentials) => {
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


export const CheckAccount = async (c: Credentials, phoneNumber: number) => {
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

export const GetChatHistory = async (c: Credentials, chatId: string): Promise<ChatHistory[]> => {
  const response = await fetch(`${BASE_URL}${c.idInstance}/getChatHistory/${c.apiTokenInstance}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({chatId}),
  });
  if (!response.ok) {
    throw new Error(`Ошибка запроса: ${response.status}`);
  }
  const data = await response.json();
  return data;
}

export const SendMessage = async (c: Credentials, chatId: string, message: string) => {
  const response = await fetch(`${BASE_URL}${c.idInstance}/sendMessage/${c.apiTokenInstance}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({chatId, message}),
  })
  if (!response.ok) {
    throw new Error(`Ошибка запроса: ${response.status}`);
  }
  const data = await response.json();
  return data;
};

export const ReceiveNotification = async (c: Credentials, signal?: AbortSignal): Promise<ReceiveNotificationItem | null> => {
  const response = await fetch(`${BASE_URL}${c.idInstance}/receiveNotification/${c.apiTokenInstance}`, {
    method: 'GET',
    signal,
  });
  if (!response.ok) {
    throw new Error(`Ошибка запроса: ${response.status}`);
  }
  const data = await response.json();
  return data;
}

export const DeleteNotification = async (c: Credentials, receiptId: number) => {
  const response = await fetch(`${BASE_URL}${c.idInstance}/deleteNotification/${c.apiTokenInstance}/${receiptId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Ошибка запроса: ${response.status}`);
  }
  const data = await response.json();
  return data;
}