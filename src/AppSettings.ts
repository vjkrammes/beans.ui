export const server = 'https://localhost:5011/';
//export const server = 'https://beansapi.azurewebsites.net/';

export const ApiBase = `${server}api/v1`;

export const DefaultHistoryDays = 30;

export const authSettings = {
  domain: '',
  client_id: '',
  redirect_uri: window.location.origin,
  scope: 'openid profile BeansAPI email',
  audience: 'https://beansapi',
};
