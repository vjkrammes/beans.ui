import {http} from './http';
import {IMovementModel} from '../Interfaces/IMovementModel';

export async function getMovements(beanid: string): Promise<IMovementModel[]> {
  if (beanid) {
    const response = await http<IMovementModel[]>({
      path: `/Movement/ForBean/${beanid}`,
    });
    if (response && response.ok && response.body) {
      return response.body;
    }
    console.error(
      'Failed to retrieve movements for bean id ' + beanid,
      response,
    );
  }
  return [];
}

export async function getMovementHistory(
  beanId: string,
  days: number,
): Promise<IMovementModel[]> {
  const response = await http<IMovementModel[]>({
    path: `/Movement/ForBean/${beanId}/${days}`,
  });
  if (response && response.ok && response.body) {
    return response.body;
  }
  return [];
}

export async function getTicker(): Promise<IMovementModel[]> {
  const response = await http<IMovementModel[]>({
    path: '/Movement/Ticker',
  });
  if (response && response.ok && response.body) {
    return response.body;
  }
  console.error(response);
  return [];
}
