import { createRoot } from 'react-dom/client';
import App from './Components/App';
import history from './utilities/history';
import { authSettings } from './AppSettings';
import { Auth0Provider } from '@auth0/auth0-react';
import { registerLicense } from '@syncfusion/ej2-base';

const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.returnTo
      ? appState.returnTo
      : window.location.pathname,
  );
};

const providerConfig = {
  domain: authSettings.domain || process.env.REACT_APP_AUTH0_DOMAIN,
  clientId: authSettings.client_id || process.env.REACT_APP_AUTH0_CLIENT_ID,
  audience: authSettings.audience,
  redirectUri: authSettings.redirect_uri,
  onRedirectCallback,
};

registerLicense(process.env.REACT_APP_SYNCFUSION_KEY);

window.onerror = (msg, url, line, col, error) => {
  let extra = col ? '\ncolumn: ' + col : '';
  extra += error ? '\nerror: ' + error : '';
  console.error('Error: ' + msg + '\nurl: ' + url + '\nline: ' + line + extra);
  return true;
};

window.onunhandledrejection = (e) => {
  console.dir(e);
  window.location.href = '/Fatal';
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <Auth0Provider {...providerConfig}>
    <App />
  </Auth0Provider>,
);
