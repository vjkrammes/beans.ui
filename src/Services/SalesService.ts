import {ISaleModel} from '../Interfaces/ISaleModel';
import {http} from './http';

export async function getSales(
  userid: string,
  token: string,
): Promise<ISaleModel[]> {
  const response = await http<ISaleModel[]>({
    path: `/Sale/ForUser/${userid}`,
    token: token,
  });
  if (response && response.ok && response.body) {
    return response.body;
  }
  console.error('Failed to retrieve sales for user with id ' + userid);
  return [];
}
