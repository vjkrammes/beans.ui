import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useUser } from '../../Contexts/UserContext';
import { useSettings } from '../../Contexts/SettingsContext';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { IAccountHoldingModel } from '../../Interfaces/IAccountHoldingModel';
import { IAccountSaleModel } from '../../Interfaces/IAccountSaleModel';
import { IBeanModel } from '../../Interfaces/IBeanModel';
import { getBeans } from '../../Services/BeanService';
import { getUserHoldings } from '../../Services/HoldingService';
import { getSales } from '../../Services/SalesService';
import { daysBetween } from '../../Services/tools';
import AccountHoldingsWidget from '../Widgets/Holding/AccountHoldingsWidget';
import BalancesWidget from '../Widgets/User/BalancesWidget';
import PageHeader from '../Widgets/Page/PageHeader';
import Spinner from '../Widgets/Spinner/Spinner';
import './AccountPage.css';
import AccountSalesWidget from '../Widgets/Sales/AccountSalesWidget';

export default function AccountPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [beans, setBeans] = useState<IBeanModel[]>([]);
  const [holdings, setHoldings] = useState<IAccountHoldingModel[]>([]);
  const [showHoldings, setShowHoldings] = useState<boolean>(true);
  const [sales, setSales] = useState<IAccountSaleModel[]>([]);
  const [showSales, setShowSales] = useState<boolean>(true);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const { user } = useUser();
  const { longTermDays } = useSettings();
  const navigate = useNavigate();
  const doGetBeans = useCallback(async () => {
    setLoading(true);
    const b = await getBeans();
    setBeans(b);
    setLoading(false);
  }, []);
  const doLoadHoldings = useCallback(async () => {
    if (user && beans && beans.length > 0) {
      setLoading(true);
      const h = await getUserHoldings(user.id, await getAccessTokenSilently());
      if (h) {
        const ah: IAccountHoldingModel[] = [];
        h.forEach((x) => {
          const bean = beans.find((y) => y.id === x.beanId);
          if (bean) {
            ah.push({
              id: x.id,
              beanName: bean!.name,
              fileName: bean!.filename,
              purchaseDate: new Date(x.purchaseDate),
              purchasePrice: x.price,
              quantity: x.quantity,
              currentPrice: bean!.price,
              gainOrLoss: bean!.price - x.price,
              percent: ((bean!.price - x.price) / x.price) * 100,
            });
          }
        });
        setHoldings(ah);
      } else {
        setHoldings([]);
      }
      setLoading(false);
    }
  }, [user, beans, getAccessTokenSilently]);
  const doLoadSales = useCallback(async () => {
    if (user && beans && beans.length > 0) {
      setLoading(true);
      const s = await getSales(user.id, await getAccessTokenSilently());
      if (s) {
        const as: IAccountSaleModel[] = [];
        s.forEach((x) => {
          const bean = beans.find((y) => y.id === x.beanId);
          if (bean) {
            as.push({
              id: x.id,
              beanName: bean!.name,
              fileName: bean!.filename,
              purchaseDate: new Date(x.purchaseDate),
              saleDate: new Date(x.saleDate),
              longTerm: daysBetween(x.saleDate, x.purchaseDate) >= longTermDays,
              quantity: x.quantity,
              costBasis: x.costBasis,
              salePrice: x.salePrice,
              gainOrLoss: x.salePrice - x.costBasis,
              percent: ((x.salePrice - x.costBasis) / x.costBasis) * 100,
            });
          }
        });
        setSales(as);
      } else {
        setSales([]);
      }
      setLoading(false);
    }
  }, [user, beans, getAccessTokenSilently, longTermDays]);
  useEffect(() => {
    if (!user || !isAuthenticated) {
      navigate('/');
    }
  }, [user, isAuthenticated, navigate]);
  useEffect(() => {
    doGetBeans();
  }, [doGetBeans]);
  useEffect(() => {
    doLoadHoldings();
  }, [doLoadHoldings]);
  useEffect(() => {
    doLoadSales();
  }, [doLoadSales]);
  return (
    <div className="container">
      <PageHeader heading="Account" showHomeButton={true} />
      {loading && (
        <div className="loading">
          <Spinner /> Loading...
        </div>
      )}
      {!loading && (
        <div className="content ap__content">
          <BalancesWidget
            user={user!}
            heading={
              <div className="ap__center ap__larger theexchange">
                Your Balances
              </div>
            }
          />
          {showHoldings && (
            <AccountHoldingsWidget
              holdings={holdings}
              heading={
                <div className="ap__center ap__larger theexchange ap__headinggrid">
                  <div className="ap__hg__heading">Your Holdings</div>
                  <button
                    className="ap__hg__button squarebutton"
                    type="button"
                    onClick={() => setShowHoldings(!showHoldings)}
                  >
                    <span>
                      {showHoldings && <FaMinus />}
                      {!showHoldings && <FaPlus />}
                    </span>
                  </button>
                </div>
              }
            />
          )}
          {!showHoldings && (
            <div className="ap__holdingexpander">
              <button
                type="button"
                className="squarebutton"
                onClick={() => setShowHoldings(true)}
              >
                <span>
                  <FaPlus />
                </span>
              </button>
              <div className="ap__hex__text">Show Your Holdings</div>
            </div>
          )}
          {showSales && (
            <AccountSalesWidget
              sales={sales}
              heading={
                <div className="ap__center ap__larger theexchange ap__headinggrid">
                  <div className="ap__hg__heading">Your Sales</div>
                  <button
                    className="squarebutton"
                    type="button"
                    onClick={() => setShowSales(!showSales)}
                  >
                    <span>
                      {showSales && <FaMinus />}
                      {!showSales && <FaPlus />}
                    </span>
                  </button>
                </div>
              }
            />
          )}
          {!showSales && (
            <div className="ap__saleexpander">
              <button
                type="button"
                className="squarebutton"
                onClick={() => setShowSales(true)}
              >
                <span>
                  <FaPlus />
                </span>
              </button>
              <div className="ap__hex__text">Show Your Sales</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
