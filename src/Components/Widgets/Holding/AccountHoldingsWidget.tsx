import { useSettings } from '../../../Contexts/SettingsContext';
import { IAccountHoldingModel } from '../../../Interfaces/IAccountHoldingModel';
import { toCurrency, toSignedCurrency } from '../../../Services/tools';
import { daysBetween } from '../../../Services/tools';
import { displayDate } from '../../../Services/tools';
import BeanNameBadge from '../Badges/BeanNameBadge';
import GainLossBadge from '../Badges/GainLossBadge';
import './AccountHoldingsWidget.css';

type Props = {
  holdings: IAccountHoldingModel[];
  heading: JSX.Element | string;
};

export default function AccountHoldingsWidget({ holdings, heading }: Props) {
  const { longTermDays } = useSettings();
  function longOrShort(pdate: Date): string {
    const purchaseDate = new Date(pdate);
    const now = new Date();
    const days = daysBetween(now, purchaseDate);
    return days >= longTermDays ? 'Long' : 'Short';
  }
  return (
    <div className="ahw__container">
      <div>{heading}</div>
      {(!holdings || holdings.length === 0) && (
        <div className="ahw__noholdings">You have no Holdings</div>
      )}
      {holdings && holdings.length > 0 && (
        <div className="ahw__holdings">
          {holdings.map((x) => (
            <div className="ahw__holding" key={x.id}>
              <BeanNameBadge
                name={x.beanName}
                filename={x.fileName}
                style={{ width: '20px' }}
              />
              <div className="ahw__item">
                <label>Purchase&nbsp;Date</label>
                <div className="ahw__value">{displayDate(x.purchaseDate)}</div>
              </div>
              <div className="ahw__item">
                <label>Purchase&nbsp;Price</label>
                <div className="ahw__value">{toCurrency(x.purchasePrice)}</div>
              </div>
              <div className="ahw__item">
                <label>Quantity</label>
                <div className="ahw__value">{x.quantity}</div>
              </div>
              <div className="ahw__item">
                <label>Current&nbsp;Price</label>
                <div className="ahw__value">{toCurrency(x.currentPrice)}</div>
              </div>
              <div className="ahw__item">
                <label>Gain&nbsp;or&nbsp;Loss</label>
                <div className="ahw__value">
                  {toSignedCurrency(x.gainOrLoss)}
                </div>
              </div>
              <div className="ahw__item">
                <label>Percent</label>
                <div className="ahw__value">
                  <GainLossBadge value={x.percent} postfix="%" />
                </div>
              </div>
              <div className="ahw__item">
                <label>Short&nbsp;/&nbsp;Long</label>
                <div className="ahw__value">{longOrShort(x.purchaseDate)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
