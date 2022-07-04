import { HttpResponse } from './http';
import { IApiResponse, SUCCESS } from '../Interfaces/IApiResponse';

export function toCurrency(value: number): string {
  return 'Ƀ' + value.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export function toSignedCurrency(value: number): string {
  const sign = value < 0 ? '' : '+';
  return (
    'Ƀ' + sign + value.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  );
}

export function prefersReducedMotion(): boolean {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  return media && media.matches;
}

export function createApiResponse(
  response: HttpResponse<IApiResponse>,
): IApiResponse {
  if (response && response.ok) {
    return SUCCESS;
  }
  if (response && response.body) {
    return response.body;
  }
  return {
    code: 8,
    message: `An unexpected error occurred (${response.code || 0})`,
    messages: [],
  };
}
