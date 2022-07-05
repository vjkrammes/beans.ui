import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useUser } from '../../Contexts/UserContext';
import { useAlert } from '../../Contexts/AlertContext';
import { useNotice } from '../../Contexts/NoticeCountContext';
import { MdCancel, MdCheck } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa';
import { IOfferModel } from '../../Interfaces/IOfferModel';
import { IHoldingModel } from '../../Interfaces/IHoldingModel';
import { IHoldingCandidate } from '../../Interfaces/IHoldingCandidate';
import {
  createOffer,
  getMyOffers,
  getOtherOffers,
  updateOffer,
  deleteOffer,
  buyFromOffer,
  sellToOffer,
} from '../../Services/OfferService';
import { getUserHoldings } from '../../Services/HoldingService';
import { toCurrency } from '../../Services/tools';
import { isSuccessResult } from '../../Interfaces/IApiResponse';
import BeanSelector from '../Widgets/Bean/BeanSelector';
import HideWidget from '../Widgets/Hide/HideWidget';
import MyOfferWidget from '../Widgets/Offer/MyOfferWidget';
import OtherOfferWidget from '../Widgets/Offer/OtherOfferWidget';
import PageHeader from '../Widgets/Page/PageHeader';
import SellHoldingWidget from '../Widgets/Holding/SellHoldingWidget';
import Spinner from '../Widgets/Spinner/Spinner';
import { ISellToOfferModel } from '../../Interfaces/ISellToOfferModel';
import './TradePage.css';

type FormData = {
  id: string;
  userId: string;
  beanId: string;
  holdingId: string;
  quantity: number;
  price: number;
  buy: boolean;
};

export default function TradePage() {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [myOffers, setMyOffers] = useState<IOfferModel[]>([]);
  const [mySelectedOffer, setMySelectedOffer] = useState<IOfferModel | null>(
    null,
  );
  const [offers, setOffers] = useState<IOfferModel[]>([]);
  const [filtering, setFiltering] = useState<boolean>(false);
  const [filteredOffers, setFilteredOffers] = useState<IOfferModel[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<IOfferModel | null>(null);
  const [holdings, setHoldings] = useState<IHoldingModel[]>([]);
  const [candidates, setCandidates] = useState<IHoldingCandidate[]>([]);
  const [oneSelected, setOneSelected] = useState<boolean>(false);
  const [someBeans, setSomeBeans] = useState<boolean>(false);
  const [selectedHolding, setSelectedHolding] = useState<IHoldingModel | null>(
    null,
  );
  const [modalTitle, setModalTitle] = useState<string>('');
  const [editing, setEditing] = useState<boolean>(false);
  const [buy, setBuy] = useState<boolean>(false);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const { user } = useUser();
  const { setAlert } = useAlert();
  const { updateUnread } = useNotice();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, watch } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: {
      id: '',
      userId: user?.id || '',
      beanId: '',
      holdingId: '',
      quantity: 0,
      price: 0,
      buy: false,
    },
  });
  const doLoadMyOffers = useCallback(async () => {
    if (user) {
      const token = await getAccessTokenSilently();
      setLoading(true);
      const result = await getMyOffers(user.id, token);
      setMyOffers(result);
      const h = await getUserHoldings(user.id, token);
      setHoldings(h);
      setLoading(false);
    }
  }, [user, getAccessTokenSilently]);
  const doLoadOffers = useCallback(async () => {
    if (user) {
      setLoading(true);
      const result = await getOtherOffers(
        user.id,
        await getAccessTokenSilently(),
      );
      setOffers(result);
      setLoading(false);
    }
  }, [user, getAccessTokenSilently]);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  useEffect(() => {
    doLoadMyOffers();
    doLoadOffers();
  }, [doLoadMyOffers, doLoadOffers]);
  function doReset(offer?: IOfferModel | undefined) {
    if (offer) {
      reset({
        id: offer.id,
        userId: user!.id,
        beanId: offer.beanId,
        holdingId: offer.holdingId,
        quantity: offer.quantity,
        price: offer.price,
        buy: offer.buy,
      });
      setSelectedHolding(holdings.find((x) => x.id === offer.holdingId)!);
    } else {
      reset({
        id: '',
        userId: user?.id || '',
        beanId: '',
        holdingId: '',
        quantity: 0,
        price: 0,
        buy: false,
      });
      setSelectedHolding(null);
    }
  }
  function holdingChanged(e: ChangeEvent<HTMLSelectElement>) {
    if (e && e.target && e.target.value) {
      const h = holdings.find((x) => x.id === e.target.value);
      if (h) {
        setSelectedHolding(h);
        return;
      }
    }
    setSelectedHolding(null);
  }
  function buyChanged(e: ChangeEvent<HTMLInputElement>) {
    setBuy(!buy);
  }
  function holdingDescription(holding: IHoldingModel): string {
    const sb: string[] = [];
    sb.push(holding.quantity.toLocaleString());
    sb.push(holding.bean!.name);
    sb.push('beans purchased on');
    sb.push(new Date(holding.purchaseDate).toLocaleDateString());
    sb.push('for');
    sb.push(toCurrency(holding.price));
    return sb.join(' ');
  }
  function offerClick(offer: IOfferModel) {
    if (offer) {
      doReset(offer);
      setEditing(true);
      setMySelectedOffer(offer);
      setModalTitle('Edit an Offer');
      setBuy(offer.buy);
      const modal = document.getElementById('tp__offermodal');
      if (modal) {
        // @ts-ignore
        modal.showModal();
      }
    } else {
      doReset();
      setMySelectedOffer(null);
      setModalTitle('');
      setBuy(false);
    }
  }
  function cancelClick() {
    const modal = document.getElementById('tp__offermodal');
    if (modal) {
      // @ts-ignore
      modal.close();
    }
  }
  async function saveOfferClick(data: FormData) {
    if (!buy) {
      if (!selectedHolding) {
        setAlert('Sell offers require a selected Holding', 'error', 5000);
        return;
      } else {
        if (data.quantity > selectedHolding.quantity) {
          setAlert(
            "Quantity is larger than that holding's quantity",
            'error',
            5000,
          );
          return;
        }
      }
    }
    if (editing) {
      const o: IOfferModel = {
        ...mySelectedOffer!,
        quantity: data.quantity,
        price: data.price,
        buy: buy,
      };
      const response = await updateOffer(o, await getAccessTokenSilently());
      if (isSuccessResult(response)) {
        await doLoadMyOffers();
        setAlert('Offer updated successfully', 'info');
      } else {
        setAlert(response.message, 'error', 5000);
      }
    } else {
      const o: IOfferModel = {
        id: '',
        userId: user!.id,
        beanId: selectedHolding!.beanId,
        holdingId: selectedHolding!.id,
        quantity: data.quantity,
        price: data.price,
        offerDate: new Date(),
        buy: buy,
      };
      const response = await createOffer(o, await getAccessTokenSilently());
      if (isSuccessResult(response)) {
        await doLoadMyOffers();
        setAlert('Offer created successfully', 'info');
      } else {
        setAlert(response.message, 'error', 5000);
      }
    }
  }
  async function deleteClick(offer: IOfferModel) {
    if (offer && offer.id) {
      const response = await deleteOffer(
        offer.id,
        await getAccessTokenSilently(),
      );
      if (isSuccessResult(response)) {
        await doLoadMyOffers();
        setAlert('Offer deleted successfully', 'info');
      } else {
        setAlert(response.message, 'error', 5000);
      }
    }
  }
  function createClick() {
    setModalTitle('Create a new Offer');
    setEditing(false);
    setSelectedHolding(null);
    setMySelectedOffer(null);
    doReset();
    const modal = document.getElementById('tp__offermodal');
    if (modal) {
      // @ts-ignore
      modal.showModal();
    }
  }
  function doStatus(status: string) {
    setStatus(status);
  }
  if (loading) {
    return (
      <div className="loading">
        <Spinner /> Loading ...
      </div>
    );
  }
  function beanChanged(id: string) {
    if (id === '0') {
      setFiltering(false);
      setFilteredOffers([]);
    } else {
      setFiltering(true);
      const o = offers.filter((x) => x.beanId === id);
      setFilteredOffers(o);
    }
  }
  function userHasEnoughBeans(offer: IOfferModel): boolean {
    const h = holdings.filter((x) => x.beanId === offer.beanId);
    if (!h || h.length === 0) {
      return false;
    }
    let sum = 0;
    h.forEach((x) => (sum += x.quantity));
    return sum >= offer.quantity;
  }
  function userCanAfford(offer: IOfferModel): boolean {
    const price = offer.quantity * offer.price;
    return (user?.balance || 0) >= price;
  }
  async function respondToOffer(offer: IOfferModel) {
    if (offer.buy && !userHasEnoughBeans(offer)) {
      setAlert(
        'You have insufficient beans to fulfill that offer',
        'error',
        5000,
      );
      return;
    }
    if (!offer.buy && !userCanAfford(offer)) {
      setAlert('You cannot afford to respond to that offer', 'error', 5000);
      return;
    }
    if (!offer.buy) {
      // buy beans from the offer
      const response = await buyFromOffer(
        user!.id,
        offer.quantity,
        offer.id,
        await getAccessTokenSilently(),
      );
      if (isSuccessResult(response)) {
        await doLoadOffers();
        setAlert('Purchase completed successfully', 'info');
        return;
      }
      setAlert(response.message, 'error', 5000);
    } else {
      setSelectedOffer(offer);
      const h = holdings.filter((x) => x.beanId === offer.beanId);
      if (!h || h.length === 0) {
        setAlert(
          'You have insufficient beans to fulfill that offer',
          'error',
          5000,
        );
        return;
      }
      const c: IHoldingCandidate[] = [];
      h.map((x) =>
        c.push({
          holdingId: x.id,
          selected: false,
          purchaseDate: new Date(x.purchaseDate),
          quantity: x.quantity,
          purchasePrice: x.price,
          sellQuantity: 0,
        }),
      );
      if (c && c.length > 0) {
        setOneSelected(false);
        setSomeBeans(false);
        setCandidates(c);
        const modal = document.getElementById('tp__sellmodal');
        if (modal) {
          // @ts-ignore
          modal.showModal();
        }
      }
    }
  }
  function displayDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }
  function atLeastOneSelected() {
    if (!candidates || candidates.length === 0) {
      setOneSelected(false);
      setSomeBeans(false);
      return;
    }
    let sel = false;
    let some = false;
    candidates.forEach((x) => {
      if (x.selected) {
        sel = true;
      }
      if (x.sellQuantity > 0) {
        some = true;
      }
    });
    setOneSelected(sel);
    setSomeBeans(some);
  }
  async function sellClick() {
    if (selectedOffer) {
      const model: ISellToOfferModel = {
        offerId: selectedOffer!.id,
        sellerId: user!.id,
        items: [],
      };
      for (let i = 0; i < candidates.length; i++) {
        if (candidates[i].selected && candidates[i].sellQuantity > 0) {
          model.items.push({
            holdingId: candidates[i].holdingId,
            quantity: candidates[i].sellQuantity,
          });
        }
      }
      if (model.items.length === 0) {
        setAlert('No candidates selected', 'error', 5000);
      } else {
        const result = await sellToOffer(model, await getAccessTokenSilently());
        if (isSuccessResult(result)) {
          await doLoadOffers();
          updateUnread();
          setAlert('Beans sold successfully', 'info');
          return;
        }
        setAlert(result.message, 'error', 5000);
      }
    } else {
      setAlert('No offer selected', 'error', 5000);
    }
  }
  function cancelSell() {
    const modal = document.getElementById('tp__sellmodal');
    if (modal) {
      // @ts-ignore
      modal.close();
    }
  }
  return (
    <div className="container">
      {/* Dialog for adding / editing offers */}
      <dialog className="modal tp__offermodal" id="tp__offermodal">
        <div className="tp__om__container">
          <div className="tp__om__title">{modalTitle}</div>
          <div className="tp__om__form">
            <form onSubmit={handleSubmit(saveOfferClick)}>
              <input type="hidden" value={user!.id} />
              <div className="formitem">
                <label className="formlabel" htmlFor="holding">
                  Holding
                </label>
                <select
                  id="holding"
                  className="forminput"
                  value={selectedHolding?.id || '0'}
                  onChange={holdingChanged}
                  disabled={buy}
                >
                  <option key={'0'} value="0">
                    Select a Holding
                  </option>
                  {holdings &&
                    holdings.length > 0 &&
                    holdings.map((x) => (
                      <option key={x.id} value={x.id}>
                        {holdingDescription(x)}
                      </option>
                    ))}
                </select>
              </div>
              <div className="formitem">
                <label className="formlabel" htmlFor="quantity">
                  Quantity
                </label>
                <input
                  type="number"
                  className="forminput"
                  min={1}
                  step={1}
                  {...register('quantity')}
                  id="quantity"
                  placeholder="Quantity"
                />
              </div>
              <div className="formitem">
                <label className="formlabel" htmlFor="price">
                  Price
                </label>
                <input
                  className="forminput"
                  type="number"
                  min={0.01}
                  step={0.01}
                  {...register('price')}
                  id="price"
                  placeholder="Price"
                />
              </div>
              <div className="formitem">
                <label className="formlabel">Offer&nbsp;Type</label>
                <div className="forminput">
                  <input
                    type="radio"
                    radioGroup="buysell"
                    checked={buy}
                    onChange={buyChanged}
                  />{' '}
                  Buy
                  <input
                    type="radio"
                    radioGroup="buysell"
                    checked={!buy}
                    onChange={buyChanged}
                  />{' '}
                  Sell
                </div>
              </div>
              <div className="buttoncontainer">
                <button
                  type="submit"
                  className="primarybutton"
                  disabled={watch('quantity') <= 0 || watch('price') <= 0}
                >
                  <span>
                    <MdCheck /> Save
                  </span>
                </button>
                <button
                  type="button"
                  className="secondarybutton"
                  onClick={cancelClick}
                >
                  <span>
                    <MdCancel /> Cancel
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
      {/* Dialog for selling to offer */}
      <dialog className="modal tp__sellmodal" id="tp__sellmodal">
        <div className="tp__sm__container">
          <div className="tp__sm__offer">
            <div className="tp__sm__title">
              Sell Beans to {selectedOffer?.user?.displayName}
            </div>
            <div className="formitem">
              <div className="formlabel">Offer&nbsp;Date</div>
              <div className="forminput">
                {displayDate(new Date(selectedOffer?.offerDate || new Date()))}
              </div>
            </div>
          </div>
          <div className="formitem">
            <div className="formlabel">Quantity</div>
            <div className="forminput">
              {(selectedOffer?.quantity || 0).toLocaleString()}
            </div>
          </div>
          <div className="formitem">
            <div className="formlabel">Price</div>
            <div className="forminput">
              {toCurrency(selectedOffer?.price || 0)}
            </div>
          </div>
          <div className="tp__sm__warning">
            <span className="emphasize">Warning:&nbsp;</span>There is no
            guarantee on the order in which holdings will be sold. If you want
            holdings sold in a specific order, sell them individually.
          </div>
          <div className="tp__sm__title">Your Holdings</div>
          {(!candidates || candidates.length === 0) && (
            <div className="tp__sm__noholdings">
              You have no candidate Holdings
            </div>
          )}
          {candidates && candidates.length > 0 && (
            <div className="tp__sm__holdingcontainer">
              <SellHoldingWidget
                candidates={candidates}
                selectClicked={(candidate: IHoldingCandidate) => {
                  atLeastOneSelected();
                }}
              />
            </div>
          )}
          <div className="buttoncontainer">
            <button
              type="button"
              className="primarybutton"
              onClick={sellClick}
              disabled={!oneSelected || !someBeans}
            >
              <span>
                <MdCheck /> OK
              </span>
            </button>
            <button
              type="button"
              className="secondarybutton"
              onClick={cancelSell}
            >
              <span>
                <MdCancel /> Cancel
              </span>
            </button>
          </div>
        </div>
      </dialog>
      <PageHeader
        heading="Trade"
        showHomeButton={true}
        secondButton={
          <button
            className="secondarybutton headerbutton-right"
            onClick={createClick}
          >
            <span>
              <FaPlus /> New&nbsp;Offer
            </span>
          </button>
        }
      />
      <div className="content">
        <div className="tp__status">{status}</div>
        <HideWidget label="Mine" content="My Offers" initialState="open">
          {(!myOffers || myOffers.length === 0) && (
            <div className="tp__noitems">You have no Offers</div>
          )}
          {myOffers && myOffers.length > 0 && (
            <div className="tp__myoffers">
              {myOffers.map((x) => (
                <MyOfferWidget
                  key={x.id}
                  offer={x}
                  onDelete={deleteClick}
                  onClick={offerClick}
                  doStatus={doStatus}
                />
              ))}
            </div>
          )}
        </HideWidget>
        <HideWidget
          label="Other"
          initialState="closed"
          content={
            <BeanSelector
              title="Other Offers"
              prefix={true}
              initialValue="0"
              selectWidth="150px"
              beanChanged={beanChanged}
            />
          }
        >
          {(!offers || offers.length === 0) && (
            <div className="tp__noitems">No other Offers</div>
          )}
          {offers && offers.length > 0 && (
            <div className="tp__otheroffers">
              {filtering &&
                filteredOffers &&
                filteredOffers.length > 0 &&
                filteredOffers.map((x) => (
                  <OtherOfferWidget
                    key={x.id}
                    offer={x}
                    onBuySell={respondToOffer}
                    doStatus={doStatus}
                  />
                ))}
              {filtering &&
                (!filteredOffers || filteredOffers.length === 0) && (
                  <div className="tp__nofilter">No Matching Offers</div>
                )}
              {!filtering &&
                offers.map((x) => (
                  <OtherOfferWidget
                    key={x.id}
                    offer={x}
                    onBuySell={respondToOffer}
                    doStatus={doStatus}
                  />
                ))}
            </div>
          )}
        </HideWidget>
      </div>
    </div>
  );
}
