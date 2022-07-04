//
// Alert related code based on this article:
//
//   https://dev.to/jeffreythecoder/set-up-react-global-alert-popup-in-10mins-36l3
//

import {AlertColor} from '@mui/material';
import {createContext, useContext, useState} from 'react';

const DEFAULT_ALERT_TIME = 2500;

const initialState = {
  text: '',
  type: '',
  alertTime: DEFAULT_ALERT_TIME,
};

const AlertContext = createContext({
  ...initialState,
  setAlert: (
    text: string,
    type: AlertColor,
    alertTime: number = DEFAULT_ALERT_TIME,
  ) => {
  },
});

type Props = {
  children: JSX.Element;
};

export const AlertProvider = ({children}: Props) => {
  const [text, setText] = useState<string>('');
  const [type, setType] = useState<AlertColor>('info');
  const [alertTime, setAlertTime] = useState<number>(DEFAULT_ALERT_TIME);
  const setAlert = (
    text: string,
    type: AlertColor,
    alertTime: number = DEFAULT_ALERT_TIME,
  ) => {
    setText(text);
    setType(type);
    setAlertTime(alertTime);
    setTimeout(() => {
      setText('');
      setType('info');
    }, alertTime);
  };
  return (
    <AlertContext.Provider value={{text, type, alertTime, setAlert}}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);

export default AlertContext;
