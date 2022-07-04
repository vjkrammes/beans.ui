import {useEffect, useState} from 'react';
import {
  Category,
  ChartComponent,
  DataLabel,
  Inject,
  Legend,
  LineSeries,
  SeriesCollectionDirective,
  SeriesDirective,
  Tooltip,
} from '@syncfusion/ej2-react-charts';
import {IBeanHistoryModel} from '../../../Interfaces/IBeanHistoryModel';
import {IPriceHistory} from '../../../Interfaces/IPriceHistory';
import {toCurrency} from '../../../Services/tools';

type Props = {
  history: IBeanHistoryModel;
  onClick?: (beanID: string) => void;
};

type ChartData = {
  date: string;
  price: number;
  label: string;
};

export default function BeanChartWidget({history, onClick}: Props) {
  const [data, setData] = useState<IPriceHistory[]>([]);
  useEffect(() => {
    let newdata: ChartData[] = [];
    if (history) {
      let m: IPriceHistory[] = [];
      m = history.prices;
      m.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      m.forEach((x) => {
        newdata.push({
          date: new Date(x.date).toISOString().split('T')[0].substring(5),
          price: x.price,
          label: toCurrency(x.price),
        });
      });
      setData(newdata);
    }
  }, [history]);
  return (
    <div
      className="bc__w__container"
      onClick={onClick ? () => onClick(history.beanId) : undefined}
      style={onClick ? {cursor: 'pointer'} : undefined}
    >
      <ChartComponent
        title={`${history.beanName} Bean History`}
        primaryXAxis={{valueType: 'Category'}}
        primaryYAxis={{interval: 5}}
        width="360px"
        height="300px"
      >
        <Inject services={[LineSeries, Legend, Tooltip, DataLabel, Category]}/>
        <SeriesCollectionDirective>
          <SeriesDirective
            dataSource={data}
            xName="date"
            yName="price"
            name="Close"
            type="Line"
            marker={{dataLabel: {visible: true, name: 'label'}}}
          />
        </SeriesCollectionDirective>
      </ChartComponent>
    </div>
  );
}
