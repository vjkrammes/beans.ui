import { useSettings } from '../../../Contexts/SettingsContext';
import { IUserModel } from '../../../Interfaces/IUserModel';
import { toCurrency } from '../../../Services/tools';
import './BalancesWidget.css';

type Props = {
  user: IUserModel;
  heading: JSX.Element | string;
};

export default function BalancesWidget({ user, heading }: Props) {
  const { maximumLoanBalance } = useSettings();
  return (
    <div className="bwidget__container">
      <div>{heading}</div>
      <div className="bwidget__balances">
        <div className="bwidget__item">
          <label>Balance</label>
          <div className="bwidget__amount">{toCurrency(user.balance)}</div>
        </div>
        <div className="bwidget__item">
          <label>Owed&nbsp;to&nbsp;Exchange</label>
          <div className="bwidget__amount">
            {toCurrency(user.owedToExchange)}
          </div>
        </div>
        <div className="bwidget__item">
          <label>Max&nbsp;Loan&nbsp;Balance</label>
          <div className="bwidget__amount">
            {toCurrency(maximumLoanBalance)}
          </div>
        </div>
        <div className="bwidget__item">
          <label>Available&nbsp;Loan&nbsp;Amount</label>
          <div className="bwidget__amount">
            {toCurrency(maximumLoanBalance - user.owedToExchange)}
          </div>
        </div>
      </div>
    </div>
  );
}
