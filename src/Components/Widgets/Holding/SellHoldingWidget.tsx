import { ChangeEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MdCheck } from 'react-icons/md';
import { IHoldingCandidate } from '../../../Interfaces/IHoldingCandidate';
import { toCurrency } from '../../../Services/tools';
import './SellHoldingWidget.css';

type Props = {
  candidates: IHoldingCandidate[];
  selectClicked: (candidate: IHoldingCandidate) => void;
};

export default function SellHoldingWidget({
  candidates,
  selectClicked,
}: Props) {
  function selectChanged(
    e: ChangeEvent<HTMLInputElement>,
    candidate: IHoldingCandidate,
  ) {
    candidate.selected = !candidate.selected;
    if (!candidate.selected) {
      candidate.sellQuantity = 0;
    }
    selectClicked(candidate);
  }
  function sellQuantityChanged(
    e: ChangeEvent<HTMLInputElement>,
    candidate: IHoldingCandidate,
  ) {
    if (e && e.target && e.target.value && candidate) {
      const num = Number(e.target.value);
      candidate.sellQuantity = num;
      selectClicked(candidate);
    }
  }
  return (
    <div className="shwidget__container">
      {(!candidates || candidates.length === 0) && (
        <div className="shwidget__nocandidates">No Candidates Found</div>
      )}
      {candidates && candidates.length > 0 && (
        <div className="shwidget__heading">
          <MdCheck />
          <div className="shwidget__small shwidget__pullcenter">
            Purchase Date
          </div>
          <div className="shwidget__small shwidget__pullright">Qty</div>
          <div className="shwidget__small shwidget__pullright">
            Purchase Price
          </div>
          <div className="shwidget__small shwidget__pullcenter">Sell</div>
        </div>
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
            <div className="shwidget__date shwidget__pullcenter">
              {new Date(x.purchaseDate)
                .toISOString()
                .split('T')[0]
                .substring(2)}
            </div>
            <div className="shwidget__quantity shwidget__pullright">
              {x.quantity}
            </div>
            <div className="shwidget__price shwidget__pullright">
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
