import { MouseEvent, useState, useEffect } from 'react';
import { MdCheck } from 'react-icons/md';
import { IOfferModel } from '../../../Interfaces/IOfferModel';
import { toCurrency } from '../../../Services/tools';
import { displayDate } from '../../../Services/tools';
import './OtherOfferWidget.css';

type Props = {
  offer: IOfferModel;
  onBuySell: (offer: IOfferModel) => void;
  doStatus?: (status: string) => void;
};

export default function OtherOfferWidget({
  offer,
  onBuySell,
  doStatus,
}: Props) {
  const [buttonText, setButtonText] = useState<string>('Respond to this offer');
  useEffect(() => {
    if (offer) {
      if (offer.buy) {
        setButtonText('Sell your beans to this offer');
      } else {
        setButtonText('Buy these beans');
      }
    }
  }, [offer]);
  function buySellClick(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    onBuySell(offer);
  }
  return (
    <div className="oow__container">
      <div className="oow__title">
        {offer.buy && <span>Offer to Buy Beans</span>}
        {!offer.buy && <span>Offer to Sell Beans</span>}
      </div>
      <div className="oow__line oow__firstline">
        <div className="oow__buysellbutton">
          <button
            type="button"
            className="squarebutton"
            title={buttonText}
            onClick={buySellClick}
            onMouseEnter={doStatus ? () => doStatus(buttonText) : undefined}
            onMouseLeave={doStatus ? () => doStatus('') : undefined}
          >
            <span>
              <MdCheck />
            </span>
          </button>
        </div>
        <div
          className="oow__offerdate"
          onMouseEnter={doStatus ? () => doStatus('Offer Date') : undefined}
          onMouseLeave={doStatus ? () => doStatus('') : undefined}
        >
          {displayDate(offer.offerDate)}
        </div>
        <div
          className="oow__offerer"
          onMouseEnter={doStatus ? () => doStatus('Offerer') : undefined}
          onMouseLeave={doStatus ? () => doStatus('') : undefined}
        >
          {offer.user!.displayName}
        </div>
      </div>
      <div className="oow__line oow__secondline">
        <div className="oow__buysell">&nbsp;</div>
        <div
          className="oow__label"
          onMouseEnter={doStatus ? () => doStatus('Offer Bean') : undefined}
          onMouseLeave={doStatus ? () => doStatus('') : undefined}
        >
          <img src={`/images/${offer.bean!.filename}`} alt="" />
          <span>{offer.bean!.name}</span>
        </div>
        <div
          className="oow__quantity oow__pullright"
          onMouseEnter={doStatus ? () => doStatus('Quantity') : undefined}
          onMouseLeave={doStatus ? () => doStatus('') : undefined}
        >
          {offer.quantity}
        </div>
        <div
          className="oow__beanprice oow__pullright"
          onMouseEnter={
            doStatus ? () => doStatus('Buy or Sell Price') : undefined
          }
          onMouseLeave={doStatus ? () => doStatus('') : undefined}
        >
          {toCurrency(offer.price)}
        </div>
      </div>
    </div>
  );
}
