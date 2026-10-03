import {API_TOKEN_INSTANCE, API_URL, ID_INSTANCE} from "../config.ts";

export const handleCheckAccount = async (phoneNumber: number) => {
  const response = await fetch(`${API_URL}/waInstance${ID_INSTANCE}/checkAccount/${API_TOKEN_INSTANCE}`, {
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

export const handleSendMessage = async (chatId: string, message: string) => {
  const responce = await fetch(`${API_URL}/waInstance${ID_INSTANCE}/sendMessage/${API_TOKEN_INSTANCE}`, {
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