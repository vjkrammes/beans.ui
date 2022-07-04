import { ChangeEvent, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useUser } from '../../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { MdRefresh } from 'react-icons/md';
import { FaFilter } from 'react-icons/fa';
import { RiForbid2Line } from 'react-icons/ri';
import { FiDivide, FiDollarSign } from 'react-icons/fi';
import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
  Inject,
  Page,
  Sort,
} from '@syncfusion/ej2-react-grids';
import { IBeanModel } from '../../Interfaces/IBeanModel';
import { ICostBasis } from '../../Interfaces/ICostBasis';
import { IHoldingModel } from '../../Interfaces/IHoldingModel';
import { ISearchHoldingsModel } from '../../Interfaces/ISearchHoldingsModel';
import { CostBasisType } from '../../Enums/CostBasisType';
import { toCurrency } from '../../Services/tools';
import { getBeans } from '../../Services/BeanService';
import { getCostBases, searchHoldings } from '../../Services/HoldingService';
import GainLossBadge from '../Widgets/Badges/GainLossBadge';
import PageHeader from '../Widgets/Page/PageHeader';
import Spinner from '../Widgets/Spinner/Spinner';
import './HoldingsPage.css';

export default function HoldingsPage() {
  const [holdings, setHoldings] = useState<IHoldingModel[]>([]);
  const [beans, setBeans] = useState<IBeanModel[]>([]);
  const [selectedBean, setSelectedBean] = useState<IBeanModel | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [oneSearchDone, setOneSearchDone] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [bases, setBases] = useState<ICostBasis[]>([]);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const { user } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    async function doLoadBeans() {
      const result = await getBeans();
      setBeans(result);
    }

    doLoadBeans();
  }, []);
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);
  useEffect(() => {
    async function doLoadBases() {
      if (user) {
        const response = await getCostBases(
          user.id,
          await getAccessTokenSilently(),
        );
        setBases(response);
      }
    }

    doLoadBases();
  }, [user, getAccessTokenSilently]);

  function resetSearchbar() {
    setSelectedBean(null);
    setStartDate('');
    setEndDate('');
    const h: IHoldingModel[] = [];
    setHoldings(h);
    setOneSearchDone(false);
    setLoading(false);
  }

  function beanChanged(e: ChangeEvent<HTMLSelectElement>) {
    if (e && e.target && e.target.value) {
      const key = e.target.value;
      if (key === '0') {
        setSelectedBean(null);
      } else {
        const b = beans.find((x) => x.id === key);
        if (b) {
          setSelectedBean(b);
        } else {
          setSelectedBean(null);
        }
      }
    }
  }

  function startDateChanged(e: ChangeEvent<HTMLInputElement>) {
    if (e && e.target && e.target.value) {
      setStartDate(e.target.value);
    } else {
      setStartDate('');
    }
  }

  function endDateChanged(e: ChangeEvent<HTMLInputElement>) {
    if (e && e.target && e.target.value) {
      setEndDate(e.target.value);
    } else {
      setEndDate('');
    }
  }

  function dateTemplate(props: IHoldingModel) {
    return (
      <span>{new Date(props.purchaseDate).toISOString().split('T')[0]}</span>
    );
  }

  function moneyTemplate(amount: number) {
    return toCurrency(amount);
  }

  function priceTemplate(props: IHoldingModel) {
    return <span>{moneyTemplate(props.price)}</span>;
  }

  async function doSearch() {
    setLoading(true);
    const model: ISearchHoldingsModel = {
      id: user!.id,
      beanId: selectedBean?.id || '',
      startDate: startDate,
      endDate: endDate,
    };
    setOneSearchDone(true);
    const result = await searchHoldings(model, await getAccessTokenSilently());
    setHoldings(result);
    setLoading(false);
  }

  function getTypeDescription(basisType: CostBasisType): JSX.Element | string {
    switch (basisType) {
      case CostBasisType.Unspecified:
        return 'Unspecified';
      case CostBasisType.NoHoldings:
        return <RiForbid2Line title={'No Holdings'} />;
      case CostBasisType.Average:
        return <FiDivide title={'Average'} />;
      case CostBasisType.Basis:
        return <FiDollarSign title={'Basis'} />;
      default:
        return 'Unknown';
    }
  }

  return (
    <div className="container">
      <PageHeader heading="Holdings" showHomeButton={true} />
      <div className="content">
        <div className="hp__current">
          <div className="hp__c__title">Current Prices</div>
          <div className="hp__c__items">
            {beans &&
              beans.length > 0 &&
              beans.map((x) => (
                <div className="hp__c__item" key={x.id}>
                  <img
                    className="hp__c__itemicon"
                    src={`/images/${x.filename}`}
                    alt=""
                  />
                  <div className="hp__c__itemname">{x.name}</div>
                  <div className="hp__c__itemprice">{toCurrency(x.price)}</div>
                </div>
              ))}
          </div>
        </div>
        <div className="hp__summary">
          <div className="hp__s__title">Holdings Summary</div>
          {(!bases || bases.length === 0) && (
            <div className="hp__s__noholdings">
              You have no Holdings to summarize
            </div>
          )}
          <div className="hp__s__items">
            {bases &&
              bases.length > 0 &&
              bases.map((x) => (
                <div className="hp__s__item" key={x.beanId}>
                  <img
                    className="hp__s__itemicon"
                    src={`/images/${x.filename}`}
                    alt=""
                  />
                  <div className="hp__s__itemname">{x.beanName}</div>
                  <div className="hp__s__itemtype">
                    {getTypeDescription(x.basisType)}
                  </div>
                  <div className="hp__s__itembasis">{toCurrency(x.basis)}</div>
                  <div className="hp__s__itempercent">
                    <GainLossBadge
                      value={x.percent}
                      postfix="%"
                      greenColor="var(--green3)"
                      redColor="var(--red4)"
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="hp__results">
          <div className="hp__r__title">Search Your Holdings</div>
          <div className="hp__searchbar">
            <div className="hp__sb__selectcontainer">
              <select
                className="hp__sb__select"
                value={selectedBean ? selectedBean.id : '0'}
                onChange={beanChanged}
              >
                <option key={'0'} value="0">
                  All Beans
                </option>
                {beans &&
                  beans.length > 0 &&
                  beans.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="hp__sb__startdate">
              <label className="formlabel">
                Start<span className="hp__sb__optional">&nbsp;Date</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={startDateChanged}
                />
              </label>
            </div>
            <div className="hp__sb__enddate">
              <label className="formlabel">
                End<span className="hp__sb__optional">&nbsp;Date</span>
                <input type="date" value={endDate} onChange={endDateChanged} />
              </label>
            </div>
            <div className="hp__sb__buttons">
              <button
                className="squarebutton hp__sb__searchbutton"
                onClick={doSearch}
              >
                <span>
                  <FaFilter />
                </span>
              </button>
              <button
                className="squarebutton hp__sb__searchbutton"
                onClick={resetSearchbar}
              >
                <span>
                  <MdRefresh />
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="hp__holdingscontainer">
          {loading && (
            <div className="loading">
              <Spinner /> Loading
            </div>
          )}
          {!loading && (
            <>
              {(!holdings || holdings.length === 0) && oneSearchDone && (
                <div className="noitemsfound">No Matching Holdings</div>
              )}
              {(!holdings || holdings.length === 0) && !oneSearchDone && <></>}
              {holdings && holdings.length > 0 && (
                <GridComponent
                  title="Holding Details"
                  dataSource={holdings}
                  allowPaging={true}
                  pageSettings={{ pageSize: 10 }}
                  allowSorting={true}
                  sortSettings={{
                    columns: [
                      {
                        field: 'purchaseDate',
                        direction: 'Descending',
                      },
                    ],
                  }}
                >
                  <ColumnsDirective>
                    <ColumnDirective
                      width="110"
                      field="purchaseDate"
                      headerText="Date"
                      template={dateTemplate}
                      allowSorting={true}
                    />
                    <ColumnDirective
                      width="70"
                      field="bean.name"
                      headerText="Bean"
                      allowSorting={true}
                    />
                    <ColumnDirective
                      width="60"
                      field="quantity"
                      headerText="#"
                      textAlign="Right"
                      allowSorting={true}
                    />
                    <ColumnDirective
                      width="110"
                      field="price"
                      headerText="Price"
                      textAlign="Right"
                      template={priceTemplate}
                      allowSorting={true}
                    />
                  </ColumnsDirective>
                  <Inject services={[Page, Sort]} />
                </GridComponent>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
