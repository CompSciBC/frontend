import { Message } from '../../../utils/dtos';

/**
 * Gets the n most recent messages for the given reservation
 *
 * @param reservationId A reservation id
 * @param n The maximum number of results to return
 * @returns A {@link Message} array promise
 */
export default async function getMessages(
  reservationId: string,
  n: number
): Promise<Message[]> {
  // TODO: replace hard coded value with messages from api
  return [
    {
      name: 'JP',
      me: false,
      time: new Date(2023, 0, 1),
      message: 'Lorem ipsum dolor.'
    },
    {
      name: 'EO',
      me: true,
      time: new Date(2023, 0, 3),
      message:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, hic. Perspiciatis placeat eos ipsum vero totam temporibus officiis voluptatibus eligendi molestiae? Animi qui quos expedita, dolorum nulla error quae labore?'
    }
  ].slice(0, n);
}
