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

export function displayDate(d: Date): string {
  return new Date(d).toISOString().split('T')[0];
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

export function daysBetween(date1: Date, date2: Date): number {
  const msecInADay = 1000 * 60 * 60 * 24;
  const d1 = new Date(date1).getTime();
  const d2 = new Date(date2).getTime();
  return (d2 - d1) / msecInADay;
}
