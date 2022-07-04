import { IApiResponse } from '../Interfaces/IApiResponse';
import { IBeanHistoryModel } from '../Interfaces/IBeanHistoryModel';
import { IBeanModel } from '../Interfaces/IBeanModel';
import { IBuyBeanModel } from '../Interfaces/IBuyBeanModel';
import { IBuySellResult } from '../Interfaces/IBuySellResult';
import { ISellBeanModel } from '../Interfaces/ISellBeanModel';
import { http } from './http';
import { createApiResponse } from './tools';

export async function getBeans(): Promise<IBeanModel[]> {
  const response = await http<IBeanModel[]>({
    path: '/Bean',
  });
  if (response && response.ok && response.body) {
    return response.body;
  }
  return [];
}

export async function beanIds(): Promise<string[]> {
  const response = await http<string[]>({
    path: '/Bean/Ids',
  });
  if (response && response.ok && response.body) {
    return response.body;
  }
  return [];
}

export async function readBean(beanId: string): Promise<IBeanModel | null> {
  const response = await http<IBeanModel | null>({
    path: `/Bean/ById/${beanId}`,
  });
  if (response && response.ok && response.body) {
    return response.body;
  }
  return null;
}

export async function getBeanHistory(
  beanId: string,
  days: number,
): Promise<IBeanHistoryModel | null> {
  const response = await http<IBeanHistoryModel | null>({
    path: `/Bean/BeanHistory/${beanId}/${days}`,
  });
  if (response && response.ok && response.body) {
    return response.body;
  }
  return null;
}

export async function getAllBeanHistory(
  days: number,
): Promise<IBeanHistoryModel[]> {
  const response = await http<IBeanHistoryModel[]>({
    path: `/Bean/AllBeanHistory/${days}`,
  });
  if (response && response.ok && response.body) {
    return response.body;
  }
  return [];
}

export async function buyBean(
  userid: string,
  beanid: string,
  quantity: number,
  token: string,
): Promise<IApiResponse> {
  const response = await http<IApiResponse>({
    path: `/Bean/Buy/${userid}/${beanid}/${quantity}`,
    method: 'post',
    token: token,
  });
  return createApiResponse(response);
}

export async function buyBeans(
  model: IBuyBeanModel,
  token: string,
): Promise<IBuySellResult[]> {
  const response = await http<IBuySellResult[], IBuyBeanModel>({
    path: '/Bean/BuyBeans',
    method: 'post',
    body: model,
    token: token,
  });
  if (response && response.ok && response.body) {
    return response.body;
  }
  return [];
}

export async function sellBeans(
  model: ISellBeanModel,
  token: string,
): Promise<IBuySellResult[]> {
  const response = await http<IBuySellResult[], ISellBeanModel>({
    path: '/Bean/SellBeans',
    method: 'post',
    body: model,
    token: token,
  });
  if (response && response.ok && response.body) {
    return response.body;
  }
  return [];
}
