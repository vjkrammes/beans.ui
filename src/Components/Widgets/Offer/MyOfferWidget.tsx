import { MouseEvent } from 'react';
import { MdDelete } from 'react-icons/md';
import { IOfferModel } from '../../../Interfaces/IOfferModel';
import { toCurrency } from '../../../Services/tools';
import { displayDate } from '../../../Services/tools';
import GainLossBadge from '../Badges/GainLossBadge';
import './MyOfferWidget.css';

type Props = {
  offer: IOfferModel;
  onDelete: (offer: IOfferModel) => void;
  onClick?: (offer: IOfferModel) => void;
  doStatus?: (status: string) => void;
};

export default function MyOfferWidget({
  offer,
  onDelete,
  onClick,
  doStatus,
}: Props) {
  function computeGain(): number {
    const basis = offer.holding!.price;
    const current = offer.bean!.price;
    const gain = current - basis;
    return (gain / basis) * 100;
  }
  function deleteClick(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    onDelete(offer);
  }
  function mouseEnterButton() {
    const divid = document.getElementById(`mow__container__${offer.id}`);
    if (divid) {
      divid.title = 'Delete this offer';
    }
  }
  function mouseLeaveButton() {
    const divid = document.getElementById(`mow__container__${offer.id}`);
    if (divid) {
      divid.title = 'Edit this offer';
    }
  }
  return (
    <div
      className="mow__container"
      title="Edit this offer"
      id={`mow__container__${offer.id}`}
      onClick={onClick ? () => onClick(offer) : undefined}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      <div className="mow__title">
        {offer.buy && <span>Offer to Buy Beans</span>}
        {!offer.buy && <span>Offer to Sell Beans</span>}
      </div>
      <div className="mow__line mow__firstline">
        <div className="mow__deletebutton">
          <button
            type="button"
            className="squarebutton dangerbutton"
            onClick={deleteClick}
            onMouseEnter={mouseEnterButton}
            onMouseLeave={mouseLeaveButton}
          >
            <span>
              <MdDelete />
            </span>
          </button>
        </div>
        <div
          className="mow__offerdate"
          onMouseEnter={doStatus ? () => doStatus('Offer Date') : undefined}
          onMouseLeave={doStatus ? () => doStatus('') : undefined}
        >
          {displayDate(offer.offerDate)}
        </div>
        <div
          className="mow__offerquantity mow__pullright"
          onMouseEnter={doStatus ? () => doStatus('Offer Quantity') : undefined}
          onMouseLeave={doStatus ? () => doStatus('') : undefined}
        >
          {offer.quantity}
        </div>
        <div
          className="mow__offerprice mow__pullright"
          onMouseEnter={doStatus ? () => doStatus('Offer Price') : undefined}
          onMouseLeave={doStatus ? () => doStatus('') : undefined}
        >
          {toCurrency(offer.price)}
        </div>
      </div>
      <div className="mow__line mow__secondline">
        <div className="mow__buysell">&nbsp;</div>
        <div
          className="mow__label"
          onMouseEnter={doStatus ? () => doStatus('Offer Bean') : undefined}
          onMouseLeave={doStatus ? () => doStatus('') : undefined}
        >
          <img src={`/images/${offer.bean!.filename}`} alt="" />
          <span>{offer.bean!.name}</span>
        </div>
        <div
          className="mow__beanprice mow__pullright"
          onMouseEnter={
            doStatus ? () => doStatus('Current Bean Price') : undefined
          }
          onMouseLeave={doStatus ? () => doStatus('') : undefined}
        >
          {toCurrency(offer.bean!.price)}
        </div>
        {offer.buy && <div className="mow__beangain mow__pullright">N/A</div>}
        {!offer.buy && (
          <div
            className="mow__beangain mow__pullright"
            onMouseEnter={
              doStatus
                ? () => doStatus('Your Gain or Loss on this Holding')
                : undefined
            }
            onMouseLeave={doStatus ? () => doStatus('') : undefined}
          >
            <GainLossBadge
              value={computeGain()}
              postfix="%"
              redColor="var(--red4)"
              greenColor="var(--green3)"
            />
          </div>
        )}
      </div>
      {offer.buy && (
        <div className="mow__noholdings">No Holding information available</div>
      )}
      {!offer.buy && (
        <div className="mow__line mow__thirdline">
          <div className="mow__blank">&nbsp;</div>
          <div className="mow__label">Holding:</div>
          <div
            className="mow__holdingdate mow__pullright"
            onMouseEnter={
              doStatus ? () => doStatus('Holding Purchase Date') : undefined
            }
            onMouseLeave={doStatus ? () => doStatus('') : undefined}
          >
            {displayDate(offer.holding!.purchaseDate)}
          </div>
          <div
            className="mow__holdingprice mow__pullright"
            onMouseEnter={
              doStatus ? () => doStatus('Holding Purchase Price') : undefined
            }
            onMouseLeave={doStatus ? () => doStatus('') : undefined}
          >
            {toCurrency(offer.holding!.price)}
          </div>
        </div>
      )}
    </div>
  );
}
