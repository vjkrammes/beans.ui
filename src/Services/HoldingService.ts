import { http } from './http';
import { IHoldingModel } from '../Interfaces/IHoldingModel';
import { IUserHoldingModel } from '../Interfaces/IUserHoldingModel';
import { IApiResponse } from '../Interfaces/IApiResponse';
import { ISearchHoldingsModel } from '../Interfaces/ISearchHoldingsModel';
import { ICostBasis } from '../Interfaces/ICostBasis';
import { createApiResponse } from './tools';

export async function getHoldings(token: string): Promise<IHoldingModel[]> {
  const response = await http<IHoldingModel[]>({
    path: '/Holding',
    token: token,
  });
  if (response && response.ok && response.body) {
    return response.body;
  }
  console.error('Failed to retrieve Holdings', response);
  return [];
}

export async function getUserHoldings(
  userid: string,
  token: string,
): Promise<IHoldingModel[]> {
  const response = await http<IHoldingModel[]>({
    path: `/Holding/ForUser/${userid}`,
    token: token,
  });
  if (response && response.ok && response.body) {
    return response.body;
  }
  console.error('Failed to retrieve user holdings', response);
  return [];
}

export async function getHoldingSummaries(
  userId: string,
  token: string,
): Promise<IUserHoldingModel[]> {
  const response = await http<IUserHoldingModel[]>({
    path: `/Holding/Holdings/${userId}`,
    token: token,
  });
  if (response && response.ok && response.body) {
    return response.body;
  }
  console.error('Failed  to retrieve holding summaries', response);
  return [];
}

export async function getCostBases(
  id: string,
  token: string,
): Promise<ICostBasis[]> {
  const response = await http<ICostBasis[]>({
    path: `/Holding/CostBases/${id}`,
    token: token,
  });
  if (response && response.ok && response.body) {
    return response.body;
  }
  console.log(`Failed to retrieve Cost Basis for user '${id}'`, response);
  return [];
}

export async function searchHoldings(
  model: ISearchHoldingsModel,
  token: string,
): Promise<IHoldingModel[]> {
  if (!model.startDate) {
    model.startDate = '0001-01-01';
  }
  if (!model.endDate) {
    model.endDate = '0001-01-01';
  }
  const response = await http<IHoldingModel[], ISearchHoldingsModel>({
    path: '/Holding/Search',
    method: 'post', // should be get but can't have a body in a get
    body: model,
    token: token,
  });
  if (response && response.ok && response.body) {
    return response.body;
  }
  console.error('Failed to search holdings', model);
  return [];
}

export async function resetHoldings(token: string): Promise<IApiResponse> {
  const response = await http<IApiResponse>({
    path: '/Holding/Reset',
    method: 'post',
    token: token,
  });
  return createApiResponse(response);
}
