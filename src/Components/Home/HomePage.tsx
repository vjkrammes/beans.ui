import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaScroll } from 'react-icons/fa';
import { IBeanHistoryModel } from '../../Interfaces/IBeanHistoryModel';
import { IMovementModel } from '../../Interfaces/IMovementModel';
import { getAllBeanHistory } from '../../Services/BeanService';
import { getTicker } from '../../Services/MovementService';
import { prefersReducedMotion } from '../../Services/tools';
import BeanChartWidget from '../Widgets/Bean/BeanChartWidget';
import Marquee from '../Widgets/Marquee/Marquee';
import PageHeader from '../Widgets/Page/PageHeader';
import './HomePage.css';

export default function HomePage() {
  const [history, setHistory] = useState<IBeanHistoryModel[]>([]);
  const [ticker, setTicker] = useState<IMovementModel[]>([]);
  const [showMarquee, setShowMarquee] = useState<boolean>(true);
  const navigate = useNavigate();
  useEffect(() => {
    async function doLoadTicker() {
      const t = await getTicker();
      setTicker(t);
    }

    async function doLoadHistory() {
      const ret = await getAllBeanHistory(7);
      setHistory(ret);
    }

    doLoadTicker();
    doLoadHistory();
  }, []);

  function beanClicked(beanid: string) {
    navigate(`/BeanDetails/${beanid}`);
  }

  function onStopScrolling() {
    setShowMarquee(false);
  }

  return (
    <div className="container">
      {prefersReducedMotion() && (
        <PageHeader heading="Beans Home" showHomeButton={false} />
      )}
      {!prefersReducedMotion() && showMarquee && (
        <PageHeader
          heading={
            <Marquee ticker={ticker} onStopScrolling={onStopScrolling} />
          }
          showHomeButton={false}
        />
      )}
      {!prefersReducedMotion() && !showMarquee && (
        <PageHeader
          heading="Beans Home"
          showHomeButton={false}
          secondButton={
            <button
              type="button"
              className="primarybutton headerbutton-left"
              onClick={() => setShowMarquee(true)}
            >
              <span>
                <FaScroll /> Show Ticker
              </span>
            </button>
          }
        />
      )}
      <div className="content">
        <div className="chartcontainer">
          {history &&
            history.map((x) => (
              <div key={x.beanId}>
                <BeanChartWidget history={x} onClick={beanClicked} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
