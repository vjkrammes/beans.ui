import { ChangeEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BsArrow90DegUp, BsArrow90DegDown } from 'react-icons/bs';
import { IHoldingCandidate } from '../../../Interfaces/IHoldingCandidate';
import { IOfferModel } from '../../../Interfaces/IOfferModel';
import './SellHoldingWidget.css';
import { toCurrency } from '../../../Services/tools';

type Props = {
  candidates: IHoldingCandidate[];
  offer: IOfferModel;
  okClick: () => void;
  cancelClick: () => void;
  selectClicked: (candidate: IHoldingCandidate) => void;
};

export default function SellHoldingWidget({
  candidates,
  offer,
  okClick,
  cancelClick,
  selectClicked,
}: Props) {
  function selectChanged(
    e: ChangeEvent<HTMLInputElement>,
    candidate: IHoldingCandidate,
  ) {
    candidate.selected = !candidate.selected;
    selectClicked(candidate);
  }
  function sellQuantityChanged(
    e: ChangeEvent<HTMLInputElement>,
    c: IHoldingCandidate,
  ) {
    console.dir(e);
    console.dir(c);
    if (e && e.target && e.target.value && c) {
      const num = Number(e.target.value);
      c.sellQuantity = num;
    }
  }
  return (
    <div className="shwidget__container">
      {(!candidates || candidates.length === 0) && (
        <div className="shwidget__nocandidates">No Candidates Found</div>
      )}
      {candidates &&
        candidates.length > 0 &&
        candidates.map((x) => (
          <div className="shwidget__item" key={uuidv4()}>
            <div className="shwidget__select">
              <input
                type="checkbox"
                className="forminput"
                defaultChecked={x.selected}
                onChange={(e) => selectChanged(e, x)}
              />
            </div>
            <div className="shwidget__order">
              <div className="shwidget__order">{x.order}</div>
            </div>
            <div className="shwidget__buttons">
              <button
                className="squarebutton mirrorimage"
                onClick={() => {}}
                disabled={x.order <= 1}
              >
                <span>
                  <BsArrow90DegUp />
                </span>
              </button>
              <button
                className="squarebutton mirrorimage"
                onClick={() => {}}
                disabled={x.order >= candidates.length}
              >
                <span>
                  <BsArrow90DegDown />
                </span>
              </button>
            </div>
            <div className="shwidget__date">
              {new Date(x.purchaseDate)
                .toISOString()
                .split('T')[0]
                .substring(2)}
            </div>
            <div className="shwidget__quantity pullright">{x.quantity}</div>
            <div className="shwidget__price pullright">
              {toCurrency(x.purchasePrice)}
            </div>
            <input
              type="number"
              min={0}
              max={x.quantity}
              step={1}
              defaultValue={x.sellQuantity}
              onChange={(e) => sellQuantityChanged(e, x)}
              disabled={!x.selected}
            />
          </div>
        ))}
    </div>
  );
}
