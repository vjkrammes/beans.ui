import {toCurrency} from '../../../Services/tools';
import {IBeanSummary} from '../../../Interfaces/IBeanSummary';
import './BeanSummaryWidget.css';

type Props = {
  bean: IBeanSummary;
};

export default function BeanSummaryWidget({bean}: Props) {
  return (
    <div className="bsw__container">
      <img className="bsw__image" src={`/images/${bean.filename}`} alt=""/>
      <div className="bsw__name">{bean.beanName}</div>
      <div className="bsw__held">{bean.heldByExchange.toLocaleString()}</div>
      <div className="bsw__price">{toCurrency(bean.price)}</div>
    </div>
  );
}
