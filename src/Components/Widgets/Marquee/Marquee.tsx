import {useEffect} from 'react';
import {MdCancel} from 'react-icons/md';
import {IMovementModel} from '../../../Interfaces/IMovementModel';
import {prefersReducedMotion} from '../../../Services/tools';
import TickerWidget from './TickerWidget';
import './Marquee.css';

type Props = {
  ticker: IMovementModel[];
  onStopScrolling: () => void;
};

export default function Marquee({ticker, onStopScrolling}: Props) {
  useEffect(() => {
    if (prefersReducedMotion()) {
      onStopScrolling();
    }
  }, [onStopScrolling]);

  function stopScrolling() {
    onStopScrolling();
  }

  return (
    <div className="marquee__container">
      <div className="marquee__scroll">
        <div className={`marquee__scroller animated`}>
          <div className="marquee__tape">
            {ticker.map((x) => (
              <TickerWidget key={x.id} movement={x} separator="|"/>
            ))}
          </div>
        </div>
        <button
          className="marquee__scrollbutton"
          type="button"
          onClick={stopScrolling}
          title="Stop animations"
        >
          <MdCancel/>
        </button>
      </div>
    </div>
  );
}
