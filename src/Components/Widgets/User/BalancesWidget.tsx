import { useState, useEffect } from 'react';
import { useSettings } from '../../../Contexts/SettingsContext';
import { IUserModel } from '../../../Interfaces/IUserModel';
import { IAccountHoldingModel } from '../../../Interfaces/IAccountHoldingModel';
import { IAccountSaleModel } from '../../../Interfaces/IAccountSaleModel';
import { toCurrency, toSignedCurrency } from '../../../Services/tools';
import './BalancesWidget.css';
import GainLossBadge from '../Badges/GainLossBadge';

type Props = {
  user: IUserModel;
  holdings: IAccountHoldingModel[];
  sales: IAccountSaleModel[];
  heading: JSX.Element | string;
};

export default function BalancesWidget({
  user,
  holdings,
  sales,
  heading,
}: Props) {
  const [holdingsGain, setHoldingsGain] = useState<number>(0);
  const [holdingsPercent, setHoldingsPercent] = useState<number>(0);
  const [salesGain, setSalesGain] = useState<number>(0);
  const [salesPercent, setSalesPercent] = useState<number>(0);
  const { maximumLoanBalance } = useSettings();
  useEffect(() => {
    let hbase = 0;
    let hcurrent = 0;
    let hgain = 0;
    holdings.forEach((x) => {
      hbase += x.purchasePrice * x.quantity;
      hcurrent += x.currentPrice * x.quantity;
      hgain += (x.currentPrice - x.purchasePrice) * x.quantity;
    });
    let sbase = 0;
    let scurrent = 0;
    let sgain = 0;
    sales.forEach((x) => {
      sbase += x.costBasis * x.quantity;
      scurrent += x.salePrice * x.quantity;
      sgain += (x.salePrice - x.costBasis) * x.quantity;
    });
    setHoldingsGain(hgain);
    if (hbase === 0) {
      setHoldingsPercent(0);
    } else {
      setHoldingsPercent(((hcurrent - hbase) / hbase) * 100);
    }
    setSalesGain(sgain);
    if (sbase === 0) {
      setHoldingsPercent(0);
    } else {
      setSalesPercent(((scurrent - sbase) / sbase) * 100);
    }
  }, [holdings, sales]);
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
        <div className="bwidget__item">
          <label>Holdings&nbsp;Gain</label>
          <div className="bwidget__amount">
            {toSignedCurrency(holdingsGain)}
          </div>
        </div>
        <div className="bwidget__item">
          <label>Holdings&nbsp;Change</label>
          <div className="bwidget__amount">
            <GainLossBadge value={holdingsPercent} postfix="%" />
          </div>
        </div>
        <div className="bwidget__item">
          <label>Sales&nbsp;Gain</label>
          <div className="bwidget__amount">{toSignedCurrency(salesGain)}</div>
        </div>
        <div className="bwidget__item">
          <label>Sales&nbsp;Change</label>
          <div className="bwidget__amount">
            <GainLossBadge value={salesPercent} postfix="%" />
          </div>
        </div>
      </div>
    </div>
  );
}
