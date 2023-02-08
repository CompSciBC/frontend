/**
 * Loads data for the invite page
 *
 * @returns A URL to access an invite QR code
 */
export default async function InviteLoader(): Promise<string> {
  const resId = 'test-res-1'; // TODO: replace hard coded resId
  const response = await fetch(`/api/invites/${resId}/qr-code`);
  const body = await response.json();
  return body.data[0];
}
