export interface IApiResponse {
  code: number;
  message: string;
  messages: string[];
}

export const SUCCESS: IApiResponse = {
  code: 0,
  message: '',
  messages: [],
};

export function isSuccessResult(response: IApiResponse): boolean {
  if (
    response &&
    response.code === 0 &&
    !response.message &&
    (!response.messages || response.messages.length === 0)
  ) {
    return true;
  }
  return false;
}
