import { createContext, useContext, useEffect, useState } from 'react';
import { ISettingsModel } from '../Interfaces/ISettingsModel';
import { getSettings } from '../Services/SettingsService';

const BANNER = 'Banner';
const INCEPTION_DATE = 'InceptionDate';
const LONG_TERM_DAYS = 'LongTermDays';
const MAXIMUM_LOAN_AMOUNT = 'MaximumLoanAmount';
const MAXIMUM_LOAN_BALANCE = 'MaximumLoanBalance';
const STARTING_BALANCE = 'StartingBalance';
const SYSTEM_ID = 'SystemId';

const SettingsContext = createContext<ISettingsModel>({
  banner: '',
  inceptionDate: new Date(),
  longTermDays: 365,
  maximumLoanAmount: 0,
  maximumLoanBalance: 0,
  startingBalance: 0,
  systemId: '',
});

type Props = {
  children: JSX.Element;
};

export const SettingsProvider = ({ children }: Props) => {
  const [banner, setBanner] = useState<string>('');
  const [inceptionDate, setInceptionDate] = useState<Date>(new Date());
  const [longTermDays, setLongTermDays] = useState<number>(365);
  const [maximumLoanAmount, setMaximumLoanAmount] = useState<number>(0);
  const [maximumLoanBalance, setMaximimLoanBalance] = useState<number>(0);
  const [startingBalance, setStartingBalance] = useState<number>(0);
  const [systemId, setSystemId] = useState<string>('');
  useEffect(() => {
    async function loadSettings() {
      const response = await getSettings();
      response.forEach((x) => {
        switch (x.name) {
          case BANNER:
            setBanner(x.value);
            break;
          case INCEPTION_DATE:
            setInceptionDate(new Date(x.value));
            break;
          case LONG_TERM_DAYS:
            setLongTermDays(Number(x.value));
            break;
          case MAXIMUM_LOAN_AMOUNT:
            setMaximumLoanAmount(Number(x.value));
            break;
          case MAXIMUM_LOAN_BALANCE:
            setMaximimLoanBalance(Number(x.value));
            break;
          case STARTING_BALANCE:
            setStartingBalance(Number(x.value));
            break;
          case SYSTEM_ID:
            setSystemId(x.value);
            break;
        }
      });
    }

    loadSettings();
  }, []);
  return (
    <SettingsContext.Provider
      value={{
        banner: banner,
        inceptionDate: inceptionDate,
        longTermDays: longTermDays,
        maximumLoanAmount: maximumLoanAmount,
        maximumLoanBalance: maximumLoanBalance,
        startingBalance: startingBalance,
        systemId: systemId,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

export default SettingsContext;
