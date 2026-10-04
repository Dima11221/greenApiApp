export interface Credentials {
  idInstance: string;
  apiTokenInstance: string;
}

export interface ChatHistory {
  type: "outgoing" | "incoming",
  idMessage: string,
  timestamp: number,
  typeMessage: string,
  chatId: string,
  chatType?: string,
  textMessage?: string,
  extendedTextMessage?:
    {
      text: string,
    },
  senderContactName?: string,
}

export interface ChatMessage {
  id: string,
  contactName?: string,
  chatId: string,
  text: string,
  own: boolean,
  timestamp: number,
}