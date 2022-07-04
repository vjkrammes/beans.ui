import {http} from './http';
import {ISetting} from '../Interfaces/ISetting';

export async function getSettings(): Promise<ISetting[]> {
  const result = await http<ISetting[]>({
    path: '/Settings',
  });
  return result.body!;
}
