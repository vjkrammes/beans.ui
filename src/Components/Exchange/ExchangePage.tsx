import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useAlert } from '../../Contexts/AlertContext';
import { useSettings } from '../../Contexts/SettingsContext';
import { v4 as uuidv4 } from 'uuid';
import { MdCancel, MdCheck, MdClear } from 'react-icons/md';
import {
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
} from 'react-icons/bs';
import { RiMoneyDollarBoxFill, RiMoneyDollarBoxLine } from 'react-icons/ri';
import { IBeanModel } from '../../Interfaces/IBeanModel';
import { IBeanSummary } from '../../Interfaces/IBeanSummary';
import { IUserHoldingModel } from '../../Interfaces/IUserHoldingModel';
import { IBuyBeanModel } from '../../Interfaces/IBuyBeanModel';
import { ISellHoldingModel } from '../../Interfaces/ISellHoldingModel';
import { IBuySellResult } from '../../Interfaces/IBuySellResult';
import { IUserModel } from '../../Interfaces/IUserModel';
import { ISellBeanModel } from '../../Interfaces/ISellBeanModel';
import { buyBeans, getBeans, sellBeans } from '../../Services/BeanService';
import {
  getHoldingSummaries,
  getUserHoldings,
} from '../../Services/HoldingService';
import { getUser, repayLoan, takeOutLoan } from '../../Services/UserService';
import { toCurrency } from '../../Services/tools';
import { isSuccessResult } from '../../Interfaces/IApiResponse';
import BeanSummaryWidget from '../Widgets/Bean/BeanSummaryWidget';
import HideWidget from '../Widgets/Hide/HideWidget';
import PageHeader from '../Widgets/Page/PageHeader';
import Spinner from '../Widgets/Spinner/Spinner';
import './ExchangePage.css';

export default function ExchangePage() {
  const [beans, setBeans] = useState<IBeanModel[]>([]);
  const [selectedBean, setSelectedBean] = useState<IBeanModel | null>(null);
  const [holdings, setHoldings] = useState<ISellHoldingModel[]>([]);
  const [selectedHoldings, setSelectedHoldings] = useState<ISellHoldingModel[]>(
    [],
  );
  const [sellCanClick, setSellCanClick] = useState<boolean>(false);
  const [summaries, setSummaries] = useState<IBeanSummary[]>([]);
  const [holdingCounts, setHoldingCounts] = useState<IUserHoldingModel[]>([]);
  const [blueBeans, setBlueBeans] = useState<number>(0);
  const [cyanBeans, setCyanBeans] = useState<number>(0);
  const [grayBeans, setGrayBeans] = useState<number>(0);
  const [greenBeans, setGreenBeans] = useState<number>(0);
  const [orangeBeans, setOrangeBeans] = useState<number>(0);
  const [purpleBeans, setPurpleBeans] = useState<number>(0);
  const [redBeans, setRedBeans] = useState<number>(0);
  const [yellowBeans, setYellowBeans] = useState<number>(0);
  const [beanCount, setBeanCount] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [dialogTitle, setDialogTitle] = useState<string>('');
  const [repay, setRepay] = useState<boolean>(true);
  const [dialogAmount, setDialogAmount] = useState<number>(0);
  const [user, setUser] = useState<IUserModel | null>(null);
  const [bsTitle, setBsTitle] = useState<string>('');
  const [bsResults, setBsResults] = useState<IBuySellResult[]>([]);
  const {
    user: Auth0User,
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();
  const { setAlert } = useAlert();
  const { maximumLoanBalance } = useSettings();
  const navigate = useNavigate();
  let modal = document.getElementById('ep__modal');
  let buysellmodal = document.getElementById('ep__buysellmodal');
  const doGetBeans = useCallback(async () => {
    const response = await getBeans();
    setBeans(response);
    let sum: IBeanSummary[] = [];
    response.forEach((x) => {
      sum.push({
        beanId: x.id,
        beanName: x.name,
        filename: x.filename,
        heldByExchange: x.exchangeHeld,
        price: x.price,
      });
    });
    setSummaries(sum);
  }, []);
  const doGetHoldingCounts = useCallback(async () => {
    if (user) {
      const response = await getHoldingSummaries(
        user!.id,
        await getAccessTokenSilently(),
      );
      setHoldingCounts(response);
    }
  }, [user, getAccessTokenSilently]);
  const doLoadHoldings = useCallback(async () => {
    if (user) {
      const h = await getUserHoldings(user.id, await getAccessTokenSilently());
      if (h && h.length > 0) {
        const sm: ISellHoldingModel[] = [];
        h.forEach((x) => {
          const bean = beans.find((y) => x.beanId === y.id);
          if (bean) {
            const shm: ISellHoldingModel = {
              id: x.id,
              beanName: bean.name,
              beanFilename: bean.filename,
              holdingDate: new Date(x.purchaseDate),
              holdingQuantity: x.quantity,
              holdingPrice: x.price,
              sellQuantity: 0,
              selected: false,
            };
            sm.push(shm);
          }
        });
        setHoldings(sm);
      }
    }
  }, [user, getAccessTokenSilently, beans]);
  const checkIfSellCanClick = useCallback(
    (holdings: ISellHoldingModel[]): boolean => {
      if (holdings && holdings.length > 0) {
        let oneselected = false;
        let total = 0;
        holdings.forEach((x) => {
          if (x.selected) {
            oneselected = true;
            total += x.sellQuantity;
          }
        });
        return oneselected && total > 0;
      }
      return false;
    },
    [],
  );
  const doReadUser = useCallback(async () => {
    if (Auth0User) {
      const u = await getUser(Auth0User.email!);
      if (u) {
        setUser(u);
      } else {
        console.error(
          "Failed to retrieve user with email '" + Auth0User.email + "'",
        );
        setUser(null);
      }
    }
  }, [Auth0User]);
  useEffect(() => {
    doReadUser();
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate, doReadUser]);
  useEffect(() => {
    doGetBeans();
  }, [doGetBeans]);
  useEffect(() => {
    doGetHoldingCounts();
  }, [doGetHoldingCounts]);
  useEffect(() => {
    doLoadHoldings();
  }, [doLoadHoldings]);
  useEffect(() => {
    if (selectedHoldings && selectedHoldings.length > 0) {
      setSellCanClick(checkIfSellCanClick(selectedHoldings));
    } else {
      setSellCanClick(false);
    }
  }, [selectedHoldings, checkIfSellCanClick]);

  async function refresh() {
    await doReadUser();
    await doLoadHoldings();
    await doGetBeans();
    await doGetHoldingCounts();
    const sh: ISellHoldingModel[] = [];
    setSelectedHoldings(sh);
    setSelectedBean(null);
  }

  function selectChanged(e: ChangeEvent<HTMLSelectElement>) {
    if (e && e.target && e.target.value) {
      const b = beans.find((x) => x.id === e.target.value);
      if (b) {
        setSelectedBean(b);
        const sh = holdings.filter(
          (x) => x.beanName.toLowerCase() === b.name.toLowerCase(),
        );
        setSelectedHoldings(sh);
        setSellCanClick(checkIfSellCanClick(sh));
        return;
      }
    }
    setSelectedBean(null);
    setSelectedHoldings([]);
    setSellCanClick(false);
  }

  function checkboxChanged(e: ChangeEvent<HTMLInputElement>) {
    if (e && e.target && e.target.id.indexOf('-') >= 0) {
      const id = e.target.id.split('-')[1];
      const holding = selectedHoldings.find((x) => x.id === id);
      if (holding) {
        holding.selected = !holding.selected;
        const q = document.getElementById(
          `sellQuantity-${id}`,
        ) as HTMLInputElement;
        if (q) {
          if (holding.selected) {
            q.disabled = false;
            q.value = holding.holdingQuantity.toString();
            holding.sellQuantity = holding.holdingQuantity;
          } else {
            q.disabled = true;
            q.value = '';
            holding.sellQuantity = 0;
          }
        }
      }
    }
    setSellCanClick(checkIfSellCanClick(selectedHoldings));
  }

  function sellQuantityChanged(e: ChangeEvent<HTMLInputElement>) {
    if (e && e.target && e.target.id.indexOf('-') >= 0) {
      const id = e.target.id.split('-')[1];
      const holding = selectedHoldings.find((x) => x.id === id);
      if (holding) {
        const q = document.getElementById(
          `sellQuantity-${id}`,
        ) as HTMLInputElement;
        const cb = document.getElementById(
          `sellCheckbox-${id}`,
        ) as HTMLInputElement;
        if (q && cb) {
          const newq = Number(q.value);
          if (newq > 0 && newq <= holding.holdingQuantity) {
            holding.selected = true;
            holding.sellQuantity = newq;
            cb.checked = true;
            setSellCanClick(checkIfSellCanClick(selectedHoldings));
          } else if (newq === 0) {
            holding.selected = false;
            holding.sellQuantity = 0;
            cb.checked = false;
            q.disabled = true;
            setSellCanClick(checkIfSellCanClick(selectedHoldings));
          } else {
            setSellCanClick(false);
            setAlert('Invalid sale quantity', 'error', 5000);
          }
        }
      }
    }
  }

  async function doSellBeans() {
    const model = buildSellModel();
    const response = await sellBeans(model, await getAccessTokenSilently());
    setBsTitle('Sell Beans Results');
    setBsResults(response);
    if (!buysellmodal) {
      buysellmodal = document.getElementById('ep__buysellmodal');
    }
    // @ts-ignore
    buysellmodal.showModal();
    await refresh();
  }

  function getBeanId(name: string): string {
    const ret = beans.find((x) => x.name.toLowerCase() === name.toLowerCase());
    if (ret) {
      return ret.id;
    }
    return '';
  }

  async function buildBuyModel(): Promise<IBuyBeanModel> {
    const ret: IBuyBeanModel = {
      userid: user!.id,
      token: await getAccessTokenSilently(),
      items: [],
    };
    if (blueBeans) {
      ret.items.push({
        name: 'Blue',
        id: getBeanId('blue'),
        quantity: blueBeans,
      });
    }
    if (cyanBeans) {
      ret.items.push({
        name: 'Cyan',
        id: getBeanId('cyan'),
        quantity: cyanBeans,
      });
    }
    if (grayBeans) {
      ret.items.push({
        name: 'Gray',
        id: getBeanId('gray'),
        quantity: grayBeans,
      });
    }
    if (greenBeans) {
      ret.items.push({
        name: 'Green',
        id: getBeanId('green'),
        quantity: greenBeans,
      });
    }
    if (orangeBeans) {
      ret.items.push({
        name: 'Orange',
        id: getBeanId('orange'),
        quantity: orangeBeans,
      });
    }
    if (purpleBeans) {
      ret.items.push({
        name: 'Purple',
        id: getBeanId('purple'),
        quantity: purpleBeans,
      });
    }
    if (redBeans) {
      ret.items.push({ name: 'Red', id: getBeanId('red'), quantity: redBeans });
    }
    if (yellowBeans) {
      ret.items.push({
        name: 'Yellow',
        id: getBeanId('yellow'),
        quantity: yellowBeans,
      });
    }
    return ret;
  }

  function buildSellModel(): ISellBeanModel {
    const ret: ISellBeanModel = {
      userid: user?.id || '',
      holdings: [],
    };
    selectedHoldings.forEach((x) => {
      if (x.selected) {
        ret.holdings.push({
          holdingId: x.id,
          quantity: x.sellQuantity,
        });
      }
    });
    return ret;
  }

  async function doBuy() {
    const model = await buildBuyModel();
    const response = await buyBeans(model, await getAccessTokenSilently());
    setBsTitle('Buy Beans Results');
    setBsResults(response);
    if (!buysellmodal) {
      buysellmodal = document.getElementById('ep__buysellmodal');
    }
    // @ts-ignore
    buysellmodal.showModal();
    await refresh();
  }

  async function closeResults() {
    await doReset();
    // @ts-ignore
    buysellmodal.close();
  }

  function doReset() {
    setBlueBeans(0);
    setCyanBeans(0);
    setGrayBeans(0);
    setGreenBeans(0);
    setOrangeBeans(0);
    setPurpleBeans(0);
    setRedBeans(0);
    setYellowBeans(0);
    setBeanCount(0);
    setTotal(0);
  }

  function dialogAmountChanged(e: ChangeEvent<HTMLInputElement>) {
    if (e && e.target && e.target.value) {
      const amt = Number(e.target.value);
      if (amt) {
        setDialogAmount(amt);
        return;
      }
    }
    setDialogAmount(0);
  }

  function makeLoanClick() {
    if (!modal) {
      modal = document.getElementById('ep__modal');
    }
    setDialogTitle('Take out a Loan');
    setRepay(false);
    setDialogAmount(0);
    // @ts-ignore
    modal.showModal();
  }

  function repayLoanClick() {
    if (!modal) {
      modal = document.getElementById('ep__modal');
    }
    setDialogTitle('Repay a Loan');
    setRepay(true);
    setDialogAmount(0);
    // @ts-ignore
    modal.showModal();
  }

  async function doLoanOrRepay() {
    // @ts-ignore
    modal.close();
    if (repay) {
      if (dialogAmount > user!.balance) {
        setAlert('Repayment amount exceeds balance', 'error', 5000);
        return;
      }
      if (dialogAmount > user!.owedToExchange) {
        setAlert('Repayment amount exceeds loan balance', 'error', 5000);
        return;
      }
      const response = await repayLoan(
        user!.id,
        dialogAmount,
        await getAccessTokenSilently(),
      );
      if (!isSuccessResult(response)) {
        setAlert(response.message, 'error', 5000);
        return;
      }
      const newUser: IUserModel = {
        ...user!,
        balance: user!.balance - dialogAmount,
        owedToExchange: user!.owedToExchange - dialogAmount,
      };
      setUser(newUser);
      setAlert('Amount repaid successfully', 'info');
    } else {
      if (dialogAmount + user!.owedToExchange > maximumLoanBalance) {
        setAlert('Loan would exceed maximum loan balance', 'error', 5000);
        return;
      }
      const response = await takeOutLoan(
        user!.id,
        dialogAmount,
        await getAccessTokenSilently(),
      );
      if (!isSuccessResult(response)) {
        setAlert(response.message, 'error', 5000);
        return;
      }
      const newUser: IUserModel = {
        ...user!,
        balance: user!.balance + dialogAmount,
        owedToExchange: user!.owedToExchange + dialogAmount,
      };
      setUser(newUser);
      setAlert('Loan taken successfully', 'info');
    }
  }

  function cancelLoan() {
    // @ts-ignore
    modal.close();
  }

  function doChange(bean: string, e: ChangeEvent<HTMLInputElement>) {
    const amount = Number(e.target.value);
    let oldAmount = 0;
    const b = beans.find((x) => x.name.toLowerCase() === bean.toLowerCase());
    if (!b) {
      setAlert(`Bean with name '${bean}' not found`, 'error', 5000);
      return;
    }
    const price = b.price;
    switch (bean) {
      case 'blue':
        oldAmount = blueBeans;
        setBlueBeans(Number(e.target.value));
        break;
      case 'cyan':
        oldAmount = cyanBeans;
        setCyanBeans(Number(e.target.value));
        break;
      case 'gray':
        oldAmount = grayBeans;
        setGrayBeans(Number(e.target.value));
        break;
      case 'green':
        oldAmount = greenBeans;
        setGreenBeans(Number(e.target.value));
        break;
      case 'orange':
        oldAmount = orangeBeans;
        setOrangeBeans(Number(e.target.value));
        break;
      case 'purple':
        oldAmount = purpleBeans;
        setPurpleBeans(Number(e.target.value));
        break;
      case 'red':
        oldAmount = redBeans;
        setRedBeans(Number(e.target.value));
        break;
      case 'yellow':
        oldAmount = yellowBeans;
        setYellowBeans(Number(e.target.value));
        break;
    }
    setBeanCount(beanCount - oldAmount + amount);
    setTotal(total - (oldAmount - amount) * price);
  }

  function pluralize(item: string, count: number): string {
    return count === 1 ? item : item + 's';
  }

  if (!user) {
    return (
      <div className="loading">
        <Spinner /> Loading...
      </div>
    );
  }
  return (
    <div className="container">
      {/* Dialog to get dollar amount for loan / repay */}
      <dialog className="modal" id="ep__modal">
        <div className="ep__modalcontent">
          <div className="ep__m__heading">{dialogTitle}</div>
          <div className="ep__m__body">
            <div>
              <span>Amount </span>
              {repay && <span>to repay</span>}
              {!repay && <span>of loan</span>}
            </div>
            <input
              type="number"
              className="forminput"
              value={dialogAmount}
              onChange={dialogAmountChanged}
              min={0}
              step={1}
              placeholder="Amount"
              autoFocus
            />
          </div>
          <div className="buttoncontainer">
            <button
              className="primarybutton"
              type="button"
              onClick={doLoanOrRepay}
              disabled={dialogAmount === 0}
            >
              <span>
                <MdCheck /> OK
              </span>
            </button>
            <button
              className="secondarybutton"
              type="button"
              onClick={cancelLoan}
            >
              <span>
                <MdCancel /> Cancel
              </span>
            </button>
          </div>
        </div>
      </dialog>
      {/* Dialog for reporting buy/sell results */}
      <dialog className="modal" id="ep__buysellmodal">
        <div className="ep__bsm__container">
          <div className="ep__bsm__title">{bsTitle}</div>
          {(!bsResults || bsResults.length === 0) && (
            <div className="ep__bsm__noresults">No Results Found</div>
          )}
          {bsResults &&
            bsResults.length > 0 &&
            bsResults.map((x) => (
              <div className="ep__bsm__result" key={uuidv4()}>
                <div className="ep__bsm__quantity">{x.quantity}</div>
                <div className="ep__bsm__bean">{x.color}</div>
                <div className="ep__bsm__spacer">
                  <span>...</span>
                </div>
                <div className="ep__bsm__message" title={x.result}>
                  {x.result}
                </div>
              </div>
            ))}
          <div className="buttoncontainer">
            <button
              type="button"
              className="primarybutton"
              onClick={closeResults}
            >
              <span>
                <MdCheck /> OK
              </span>
            </button>
          </div>
        </div>
      </dialog>
      <PageHeader heading="Exchange" showHomeButton={true} />
      <div className="content">
        <div className="ep__balancescontainer">
          <div className="ep__heading theexchange">Your Balances</div>
          <div className="ep__bc__balances">
            <div className="ep__bc__number">
              <label>Balance</label>
              <div className="ep__bc__amount">{toCurrency(user!.balance)}</div>
            </div>
            <div className="ep__bc__number">
              <label>Owed&nbsp;To&nbsp;Exchange</label>
              <div className="ep__bc__amount">
                {toCurrency(user!.owedToExchange)}
              </div>
            </div>
            <div className="ep__bc__number">
              <label>Max&nbsp;Loan&nbsp;Balance</label>
              <div className="ep__bc__amount">
                {toCurrency(maximumLoanBalance)}
              </div>
            </div>
            <div className="ep__bc__number">
              <label>Available&nbsp;Loan&nbsp;Amount</label>
              <div className="ep__bc__amount">
                {toCurrency(maximumLoanBalance - user!.owedToExchange)}
              </div>
            </div>
            <div className="buttoncontainer wide">
              <button
                type="button"
                className="primarybutton"
                onClick={makeLoanClick}
                disabled={user!.owedToExchange >= maximumLoanBalance}
              >
                <span>
                  <RiMoneyDollarBoxFill /> Loan
                </span>
              </button>
              <button
                type="button"
                className="primarybutton"
                onClick={repayLoanClick}
                disabled={user!.owedToExchange === 0}
              >
                <span>
                  <RiMoneyDollarBoxLine /> Repay
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="ep__exchangecontainer">
          <div className="ep__heading theexchange">The Exchange Holdings</div>
          <div className="ep__ex__summaries">
            {summaries &&
              summaries.length > 0 &&
              summaries.map((x) => (
                <BeanSummaryWidget key={x.beanId} bean={x} />
              ))}
          </div>
        </div>
        <div className="ep__buycontainer">
          <HideWidget
            label="Buy"
            content="Buy Beans from the Exchange"
            initialState="closed"
          >
            <div className="ep__heading theexchange">Buy Beans</div>
            <form className="ep__buysellform">
              <div className="ep__f__container">
                <div className="ep__f__item">
                  <label className="formlabel" htmlFor="blue">
                    Blue
                  </label>
                  <input
                    type="number"
                    className="forminput"
                    id="blue"
                    value={blueBeans}
                    onChange={(e) => doChange('blue', e)}
                    min={0}
                    step={1}
                  />
                </div>
                <div className="ep__f__item">
                  <label className="formlabel" htmlFor="cyan">
                    Cyan
                  </label>
                  <input
                    type="number"
                    className="forminput"
                    id="cyan"
                    value={cyanBeans}
                    onChange={(e) => doChange('cyan', e)}
                    min={0}
                    step={1}
                  />
                </div>
                <div className="ep__f__item">
                  <label className="formlabel" htmlFor="gray">
                    Gray
                  </label>
                  <input
                    type="number"
                    className="forminput"
                    id="gray"
                    value={grayBeans}
                    onChange={(e) => doChange('gray', e)}
                    min={0}
                    step={1}
                  />
                </div>
                <div className="ep__f__item">
                  <label className="formlabel" htmlFor="green">
                    Green
                  </label>
                  <input
                    type="number"
                    className="forminput"
                    id="green"
                    value={greenBeans}
                    onChange={(e) => doChange('green', e)}
                    min={0}
                    step={1}
                  />
                </div>
                <div className="ep__f__item">
                  <label className="formlabel" htmlFor="orange">
                    Orange
                  </label>
                  <input
                    type="number"
                    className="forminput"
                    id="orange"
                    value={orangeBeans}
                    onChange={(e) => doChange('orange', e)}
                    min={0}
                    step={1}
                  />
                </div>
                <div className="ep__f__item">
                  <label className="formlabel" htmlFor="purple">
                    Purple
                  </label>
                  <input
                    type="number"
                    className="forminput"
                    id="purple"
                    value={purpleBeans}
                    onChange={(e) => doChange('purple', e)}
                    min={0}
                    step={1}
                  />
                </div>
                <div className="ep__f__item">
                  <label className="formlabel" htmlFor="red">
                    Red
                  </label>
                  <input
                    type="number"
                    className="forminput"
                    id="red"
                    value={redBeans}
                    onChange={(e) => doChange('red', e)}
                    min={0}
                    step={1}
                  />
                </div>
                <div className="ep__f__item">
                  <label className="formlabel" htmlFor="yellow">
                    Yellow
                  </label>
                  <input
                    type="number"
                    className="forminput"
                    id="yellow"
                    value={yellowBeans}
                    onChange={(e) => doChange('yellow', e)}
                    min={0}
                    step={1}
                  />
                </div>
              </div>
              <div className="buttoncontainer">
                <button
                  type="button"
                  className="primarybutton"
                  onClick={doBuy}
                  disabled={beanCount === 0 || total > (user?.balance ?? 0)}
                >
                  <span>
                    <BsFillArrowDownSquareFill /> Buy
                  </span>
                </button>
                <button
                  type="button"
                  className="secondarybutton"
                  onClick={doReset}
                >
                  <span>
                    <MdClear /> Reset
                  </span>
                </button>
              </div>
              <div className="ep__f__totalcontainer">
                <span>{beanCount}</span>
                <span> {pluralize('bean', beanCount)} </span>
                <span className="nosmall"> selected, total amount </span>
                <span className="nolarge">, total </span>
                <span>{toCurrency(total).replace('-', '')}</span>
              </div>
            </form>
          </HideWidget>
        </div>
        <div className="ep__sellcontainer">
          <HideWidget
            label="Sell"
            content="Sell Beans to the Exchange"
            initialState="closed"
          >
            {(!holdings || holdings.length === 0) && (
              <div className="ep__noholdings">You have no holdings</div>
            )}
            {holdings && holdings.length > 0 && (
              <div className="ep__holdingcontainer">
                <div className="ep__heading theexchange">
                  Sell Beans to the Exchange
                </div>
                <div className="ep__hc__body">
                  <div className="ep__hc__beanselect">
                    <select
                      onChange={selectChanged}
                      value={selectedBean?.id || '0'}
                    >
                      <option key={'0'} value="0">
                        Select a Bean
                      </option>
                      {beans.map((x) => (
                        <option key={x.id} value={x.id}>
                          {x.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {(!selectedHoldings || selectedHoldings.length === 0) && (
                    <div className="ep__noholdings">
                      {selectedBean && (
                        <span>
                          You have no {selectedBean.name || ''} holdings
                        </span>
                      )}
                      {!selectedBean && <span>Please select a bean</span>}
                    </div>
                  )}
                  {selectedHoldings && selectedHoldings.length > 0 && (
                    <div className="ep__hc__holdings">
                      <div className="ep__hc__title">
                        Your {selectedBean!.name} holdings
                      </div>
                      <div className="ep__hc__heading">
                        <div className="ep__hc__h__date">Purchased</div>
                        <div className="ep__hc__h__price">Price</div>
                        <div className="ep__hc__h__quantity">#</div>
                      </div>
                      {selectedHoldings.map((x) => (
                        <div className="ep__hc__holding" key={x.id}>
                          <div className="ep__hc__h__date">
                            {new Date(x.holdingDate).toLocaleDateString()}
                          </div>
                          <div className="ep__hc__h__price">
                            {x.holdingPrice.toLocaleString()}
                          </div>
                          <div className="ep__hc__h__quantity">
                            {x.holdingQuantity.toLocaleString()}
                          </div>
                          <div className="ep__hc__h__select">
                            <label>
                              <input
                                type="checkbox"
                                onChange={checkboxChanged}
                                id={`sellCheckbox-${x.id}`}
                              />{' '}
                              Select
                            </label>
                          </div>
                          <div className="ep__hc__h__sellquantity">
                            <input
                              type="number"
                              min={0}
                              max={x.holdingQuantity}
                              step={1}
                              id={`sellQuantity-${x.id}`}
                              onChange={sellQuantityChanged}
                              placeholder="Sell"
                            />
                          </div>
                        </div>
                      ))}
                      <div className="buttoncontainer ep__hc__h__sellbuttoncontainer">
                        <button
                          type="button"
                          className="primarybutton"
                          onClick={doSellBeans}
                          disabled={!sellCanClick}
                        >
                          <span>
                            <BsFillArrowUpSquareFill /> Sell
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </HideWidget>
        </div>
        <div className="ep__usercontainer">
          <div className="ep__heading theexchange">Your Holdings</div>
          <div className="ep__uc__holdings">
            {holdingCounts &&
              holdingCounts.length > 0 &&
              holdingCounts.map((x) => (
                <div className="bbw__container" key={x.id}>
                  <img
                    className="bbw__image"
                    src={`/images/${x.filename}`}
                    alt=""
                  />
                  <div className="bbw__name">{x.name}</div>
                  <div className="bbw__held">{x.held.toLocaleString()}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
