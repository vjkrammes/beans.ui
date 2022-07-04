import {IMovementModel} from '../../../Interfaces/IMovementModel';
import {getHex} from '../../../Services/ColorService';
import {toCurrency, toSignedCurrency} from '../../../Services/tools';
import './TickerWidget.css';

type Props = {
  movement: IMovementModel;
  separator?: string | JSX.Element | undefined;
};

export default function TickerWidget({movement, separator}: Props) {
  return (
    <div className="tckw__container">
      <img
        className="tckw__image"
        src={`/images/${movement.bean!.filename}`}
        alt=""
      />
      <div
        className="tckw__name"
        style={{color: getHex(movement.bean!.name)}}
      >
        {movement.bean!.name}
      </div>
      <div className="tckw__open">{toCurrency(movement.open)}</div>
      <div className="tckw__close">{toCurrency(movement.close)}</div>
      <div
        className="tckw__change"
        style={
          movement.movement < 0
            ? {color: 'red'}
            : movement.movement > 0
              ? {color: 'green'}
              : undefined
        }
      >
        {toSignedCurrency(movement.movement)}
      </div>
      {separator && <div className="tckw__separator">{separator}</div>}
    </div>
  );
}
