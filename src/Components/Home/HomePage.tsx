import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IBeanHistoryModel } from '../../Interfaces/IBeanHistoryModel';
import { getAllBeanHistory } from '../../Services/BeanService';
import { IMovementModel } from '../../Interfaces/IMovementModel';
import { getTicker } from '../../Services/MovementService';
import { prefersReducedMotion } from '../../Services/tools';
import BeanChartWidget from '../Widgets/Bean/BeanChartWidget';
import Marquee from '../Widgets/Marquee/Marquee';
import './HomePage.css';
import PageHeader from '../Widgets/Page/PageHeader';

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
      {showMarquee && !prefersReducedMotion() && (
        <PageHeader
          heading={
            <Marquee ticker={ticker} onStopScrolling={onStopScrolling} />
          }
          showHomeButton={false}
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
