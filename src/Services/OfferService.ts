import { IApiResponse } from '../Interfaces/IApiResponse';
import { IOfferModel } from '../Interfaces/IOfferModel';
import { ISellToOfferModel } from '../Interfaces/ISellToOfferModel';
import { http } from './http';
import { createApiResponse } from './tools';

export async function getOffers(
  userid: string,
  token: string,
): Promise<IOfferModel[]> {
  const response = await http<IOfferModel[]>({
    path: `/Offer/MyOffers/${userid}`,
    token: token,
  });
  if (response && response.ok && response.body) {
    return response.body;
  }
  console.error('Failed to retrieve offers for user with id ' + userid);
  return [];
}

export async function getMyOffers(
  id: string,
  token: string,
): Promise<IOfferModel[]> {
  const response = await http<IOfferModel[]>({
    path: `/Offer/MyOffers/${id}`,
    token: token,
  });
  if (response && response.ok && response.body) {
    return response.body;
  }
  console.error('Failed to retrieve offers for user with id ' + id);
  return [];
}

export async function getOtherOffers(
  id: string,
  token: string,
): Promise<IOfferModel[]> {
  const response = await http<IOfferModel[]>({
    path: `/Offer/Others/${id}`,
    token: token,
  });
  if (response && response.ok && response.body) {
    return response.body;
  }
  console.error('Failed to retrieve other offers for user with id ' + id);
  return [];
}

export async function createOffer(
  offer: IOfferModel,
  token: string,
): Promise<IApiResponse> {
  const response = await http<IApiResponse, IOfferModel>({
    path: '/Offer',
    method: 'post',
    body: offer,
    token: token,
  });
  return createApiResponse(response);
}

export async function updateOffer(
  offer: IOfferModel,
  token: string,
): Promise<IApiResponse> {
  const response = await http<IApiResponse, IOfferModel>({
    path: `/Offer`,
    method: 'put',
    body: offer,
    token: token,
  });
  return createApiResponse(response);
}

export async function deleteOffer(
  id: string,
  token: string,
): Promise<IApiResponse> {
  const response = await http<IApiResponse>({
    path: `/Offer/${id}`,
    method: 'delete',
    token: token,
  });
  return createApiResponse(response);
}

export async function buyFromOffer(
  userid: string,
  quantity: number,
  offerid: string,
  token: string,
) {
  const response = await http<IApiResponse>({
    path: `/Offer/Buy/${userid}/${quantity}/${offerid}`,
    method: 'post',
    token: token,
  });
  return createApiResponse(response);
}

export async function sellToOffer(
  model: ISellToOfferModel,
  token: string,
): Promise<IApiResponse> {
  const response = await http<IApiResponse, ISellToOfferModel>({
    path: '/Offer/Sell',
    method: 'post',
    body: model,
    token: token,
  });
  return createApiResponse(response);
}
