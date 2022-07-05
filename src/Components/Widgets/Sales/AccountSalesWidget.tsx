import { IAccountSaleModel } from '../../../Interfaces/IAccountSaleModel';
import { toCurrency, toSignedCurrency } from '../../../Services/tools';
import { displayDate } from '../../../Services/tools';
import BeanNameBadge from '../Badges/BeanNameBadge';
import GainLossBadge from '../Badges/GainLossBadge';
import './AccountSalesWidget.css';

type Props = {
  sales: IAccountSaleModel[];
  heading: JSX.Element | string;
};

export default function AccountSalesWidget({ sales, heading }: Props) {
  return (
    <div className="asw__container">
      <div>{heading}</div>
      {(!sales || sales.length === 0) && (
        <div className="asw__nosales">You have no Sales</div>
      )}
      {sales && sales.length > 0 && (
        <div className="asw__sales">
          {sales.map((x) => (
            <div className="asw__sale" key={x.id}>
              <BeanNameBadge
                name={x.beanName}
                filename={x.fileName}
                style={{ width: '20px' }}
              />
              <div className="asw__item">
                <label>Purchase&nbsp;Date</label>
                <div className="asw__value">{displayDate(x.purchaseDate)}</div>
              </div>
              <div className="asw__item">
                <label>Sale&nbsp;Date</label>
                <div className="asw__value">{displayDate(x.saleDate)}</div>
              </div>
              <div className="asw__item">
                <label>Short&nbsp;/&nbsp;Long</label>
                <div className="asw__value">
                  {x.longTerm ? 'Long' : 'Short'}
                </div>
              </div>
              <div className="asw__item">
                <label>Quantity</label>
                <div className="asw__value">{x.quantity}</div>
              </div>
              <div className="asw__item">
                <label>Cost&nbsp;Basis</label>
                <div className="asw__value">{toCurrency(x.costBasis)}</div>
              </div>
              <div className="asw__item">
                <label>Sale&nbsp;Price</label>
                <div className="asw__value">{toCurrency(x.salePrice)}</div>
              </div>
              <div className="asw__item">
                <label>Gain&nbsp;or&nbsp;Loss</label>
                <div className="asw__value">
                  {toSignedCurrency(x.gainOrLoss)}
                </div>
              </div>
              <div className="asw__item">
                <label>Percent</label>
                <div className="asw__value">
                  <GainLossBadge value={x.percent} postfix="%" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
