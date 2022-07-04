import { useEffect, useState } from 'react';
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
import { IMovementModel } from '../../../Interfaces/IMovementModel';
import { toCurrency } from '../../../Services/tools';
import './MovementChartWidget.css';

type Props = {
  movements: IMovementModel[];
};

type ChartData = {
  date: string;
  price: number;
  label: string;
};

export default function MovementChartWidget({ movements }: Props) {
  const [openData, setOpenData] = useState<ChartData[]>();
  const [closeData, setCloseData] = useState<ChartData[]>();
  useEffect(() => {
    let oData: ChartData[] = [];
    let cData: ChartData[] = [];
    if (movements) {
      movements.sort(
        (a, b) =>
          new Date(a.movementDate).getTime() -
          new Date(b.movementDate).getTime(),
      );
      movements.forEach((x) => {
        const date = new Date(x.movementDate);
        oData.push({
          date: date.getMonth() + 1 + '/' + date.getDate(),
          price: x.open,
          label: toCurrency(x.open),
        });
        cData.push({
          date: date.getMonth() + 1 + '/' + date.getDate(),
          price: x.close,
          label: toCurrency(x.close),
        });
      });
      setOpenData(oData);
      setCloseData(cData);
    }
  }, [movements]);
  return (
    <div className="mc__w__container">
      <ChartComponent
        title={`Price History`}
        primaryXAxis={{ valueType: 'Category', interval: 2 }}
        primaryYAxis={{ interval: 5 }}
        width="90%"
      >
        <Inject services={[LineSeries, Legend, Tooltip, DataLabel, Category]} />
        <SeriesCollectionDirective>
          <SeriesDirective
            dataSource={openData}
            xName="date"
            yName="price"
            name="Open"
            marker={{ dataLabel: { visible: true, name: 'label' } }}
          />
          <SeriesDirective
            dataSource={closeData}
            xName="date"
            yName="price"
            name="Close"
            marker={{ dataLabel: { visible: true, name: 'label' } }}
          />
        </SeriesCollectionDirective>
      </ChartComponent>
    </div>
  );
}
