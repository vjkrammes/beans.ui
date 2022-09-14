import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
  Inject,
  Page,
  Sort,
} from '@syncfusion/ej2-react-grids';
import { getBeans } from '../../Services/BeanService';
import { getMovements } from '../../Services/MovementService';
import { IBeanModel } from '../../Interfaces/IBeanModel';
import { IMovementModel } from '../../Interfaces/IMovementModel';
import { toCurrency, toSignedCurrency } from '../../Services/tools';
import BeanBadge from '../Widgets/Badges/BeanBadge';
import HideWidget from '../Widgets/Hide/HideWidget';
import MovementChartWidget from '../Widgets/Movement/MovementChartWidget';
import PageHeader from '../Widgets/Page/PageHeader';
import Spinner from '../Widgets/Spinner/Spinner';
import './BeanDetailsPage.css';
import { DefaultHistoryDays } from '../../AppSettings';

export default function BeanDetailsPage() {
  const { beanId } = useParams();
  const [beans, setBeans] = useState<IBeanModel[]>([]);
  const [bean, setBean] = useState<IBeanModel | null>(null);
  const [movements, setMovements] = useState<IMovementModel[]>([]);
  const [days, setDays] = useState<number>(DefaultHistoryDays);
  const navigate = useNavigate();
  useEffect(() => {
    async function doLoadBeans() {
      const b = await getBeans();
      setBeans(b);
      const theBean = b.find((x) => x.id === beanId);
      if (theBean) {
        setBean(theBean);
      } else {
        console.error("Unable to locate bean with id '" + beanId + "'");
      }
    }

    doLoadBeans();
  }, [beanId]);
  useEffect(() => {
    async function doLoadMovements() {
      const m = await getMovements(beanId || '', days);
      setMovements(m);
    }

    doLoadMovements();
  }, [beanId, days]);

  function beanChanged(e: ChangeEvent<HTMLSelectElement>) {
    if (e && e.target && e.target.value) {
      navigate(`/BeanDetails/${e.target.value}`);
    }
  }

  function daysChanged(e: ChangeEvent<HTMLSelectElement>) {
    if (e && e.target && e.target.value) {
      const d = Number(e.target.value);
      if (d > 0) {
        setDays(d);
      }
    }
  }

  function dateTemplate(props: IMovementModel) {
    return (
      <span>{new Date(props.movementDate).toISOString().split('T')[0]}</span>
    );
  }

  function moneyTemplate(amount: number): string {
    return toCurrency(amount);
  }

  function openTemplate(props: IMovementModel) {
    return <span>{moneyTemplate(props.open)}</span>;
  }

  function closeTemplate(props: IMovementModel) {
    return <span>{moneyTemplate(props.close)}</span>;
  }

  function changeTemplate(props: IMovementModel) {
    return <span>{toSignedCurrency(props.movement)}</span>;
  }

  return (
    <div className="container">
      <PageHeader
        heading={
          <BeanBadge bean={bean!} height="24px" content="Bean History" />
        }
        showHomeButton={true}
      />
      {!bean && (
        <div className="loading">
          <Spinner /> Loading ...
        </div>
      )}
      {bean && (
        <div className="content">
          <div className="bdp__combocontainer">
            <div className="bdp__selectcontainer">
              <div>Select a different Bean:</div>
              <select
                className="bdp__beanlist"
                value={bean?.id}
                onChange={beanChanged}
              >
                {beans.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="bdp__selectcontainer">
              <div>Select Days of History:</div>
              <select
                className="bdp__dayslist"
                value={days}
                onChange={daysChanged}
              >
                <option key="7" value="7">
                  7
                </option>
                <option key="15" value="15">
                  15
                </option>
                <option key="30" value="30">
                  30
                </option>
                <option key="60" value="60">
                  60
                </option>
                <option key="90" value="90">
                  90
                </option>
              </select>
            </div>
          </div>
          <div className="bdp__chartcontainer">
            <MovementChartWidget movements={movements} />
          </div>
          <div className="bdp__detailcontainer">
            <HideWidget
              initialState="closed"
              label="Details"
              content="Movement Details"
            >
              <div className="bdp__details">
                <GridComponent
                  title="Movement Detail Data"
                  dataSource={movements}
                  allowPaging={true}
                  pageSettings={{ pageSize: 10 }}
                  allowSorting={true}
                  sortSettings={{
                    columns: [
                      {
                        field: 'movementDate',
                        direction: 'Descending',
                      },
                    ],
                  }}
                >
                  <ColumnsDirective>
                    <ColumnDirective
                      width="100"
                      field="movementDate"
                      headerText="Date"
                      template={dateTemplate}
                    />
                    <ColumnDirective
                      width="75"
                      field="open"
                      textAlign="Right"
                      headerText="Open"
                      template={openTemplate}
                    />
                    <ColumnDirective
                      width="75"
                      field="close"
                      textAlign="Right"
                      headerText="Close"
                      template={closeTemplate}
                    />
                    <ColumnDirective
                      width="50"
                      field="movement"
                      textAlign="Right"
                      headerText="+/-"
                      template={changeTemplate}
                    />
                  </ColumnsDirective>
                  <Inject services={[Page, Sort]} />
                </GridComponent>
              </div>
            </HideWidget>
          </div>
        </div>
      )}
    </div>
  );
}
