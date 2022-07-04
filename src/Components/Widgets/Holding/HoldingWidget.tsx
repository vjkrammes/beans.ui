import { IHoldingModel } from '../../../Interfaces/IHoldingModel';
import { toCurrency } from '../../../Services/tools';
import './HoldingWidget.css';

type Props = {
  holding: IHoldingModel;
};

export default function HoldingWidget({ holding }: Props) {
  return (
    <div className="holdw__container">
      <img src={`/images/${holding.bean!.filename}`} alt="" />
      <div className="holdw__name">{holding.bean!.name}</div>
      <div className="holdw__date">
        {new Date(holding.purchaseDate).toLocaleDateString()}
      </div>
      <div className="holdw__quantity">{holding.quantity}</div>
      <div className="holdw__price">{toCurrency(holding.price)}</div>
    </div>
  );
}
