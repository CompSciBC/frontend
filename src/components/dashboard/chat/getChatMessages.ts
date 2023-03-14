import { Message, User } from '../../../utils/dtos';
import { server } from '../../../index';

/**
 * Gets the n most recent messages for the given reservation
 *
 * @param resId A reservation id
 * @param n The maximum number of results to return
 * @returns A {@link Message} array promise
 */

interface RawMessage {
  reservationId: String;
  timestamp: Number;
  senderName: String;
  message: String;
  receiverName: String | undefined;
  chatId: String;
}

export default async function getMessages(
  resID: string,
  user: User
): Promise<Message[]> {
  const loadUrl: string = `${server}/api/chat/load/chat-preview/${resID}`;
  return await fetch(loadUrl, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }).then(async (response) => {
    const rawMessages = await response.json();

    if (rawMessages.length === 0) {
      return [
        {
          name: 'Host',
          me: false,
          time: new Date(),
          message: 'Hello'
        }
      ];
    }
    return rawMessages.map((message: RawMessage) => ({
      name: message.senderName,
      me: message.senderName === user.username,
      time: new Date(),
      message: message.message
    }));
  });
}

