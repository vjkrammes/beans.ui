import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth0 } from '@auth0/auth0-react';
import { useUser } from '../../Contexts/UserContext';
import { useAlert } from '../../Contexts/AlertContext';
import {
  MdArrowBack,
  MdCancel,
  MdCheck,
  MdClear,
  MdSave,
} from 'react-icons/md';
import { FaUser, FaUserSecret } from 'react-icons/fa';
import { IHoldingModel } from '../../Interfaces/IHoldingModel';
import { INoticeModel } from '../../Interfaces/INoticeModel';
import { IOfferModel } from '../../Interfaces/IOfferModel';
import { ISaleModel } from '../../Interfaces/ISaleModel';
import { IUserModel } from '../../Interfaces/IUserModel';
import { IChangeProfileModel } from '../../Interfaces/IChangeProfileModel';
import { IApiResponse, isSuccessResult } from '../../Interfaces/IApiResponse';
import { getUserHoldings } from '../../Services/HoldingService';
import { getNotices } from '../../Services/NoticeService';
import { getOffers } from '../../Services/OfferService';
import { getSales } from '../../Services/SalesService';
import {
  getUserById,
  toggleAdmin,
  updateUserModel,
} from '../../Services/UserService';
import { toCurrency } from '../../Services/tools';
import HideWidget from '../Widgets/Hide/HideWidget';
import PageHeader from '../Widgets/Page/PageHeader';
import Spinner from '../Widgets/Spinner/Spinner';
import GroupBox from '../Widgets/GroupBox/GroupBox';
import './DetailsPage.css';

type FormData = {
  identifier: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  isAdmin: boolean;
};

export default function DetailsPage() {
  const { userid } = useParams();
  const [user, setUser] = useState<IUserModel>();
  const [holdings, setHoldings] = useState<IHoldingModel[]>([]);
  const [notices, setNotices] = useState<INoticeModel[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<INoticeModel | null>(
    null,
  );
  const [offers, setOffers] = useState<IOfferModel[]>([]);
  const [sales, setSales] = useState<ISaleModel[]>([]);
  const [statusText, setStatusText] = useState<string>('');
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const { isAdmin } = useUser();
  const { setAlert } = useAlert();
  const { register, handleSubmit, reset } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: {
      identifier: user?.identifier || '',
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      displayName: user?.displayName || '',
      isAdmin: user?.isAdmin || false,
    },
  });
  const navigate = useNavigate();
  let notice_modal = document.getElementById('detp__noticemodal');
  const doLoadData = useCallback(async () => {
    if (user?.id) {
      const token = await getAccessTokenSilently();
      const h = await getUserHoldings(user.id, token);
      setHoldings(h);
      const n = await getNotices(user.id, token);
      setNotices(n);
      const o = await getOffers(user.id, token);
      setOffers(o);
      const s = await getSales(user.id, token);
      setSales(s);
    }
  }, [user, getAccessTokenSilently]);
  const doLoadUser = useCallback(async () => {
    if (userid) {
      const response = await getUserById(userid);
      if (response) {
        setUser(response);
      }
    }
  }, [userid]);
  const doReset = useCallback(() => {
    reset({
      identifier: user?.identifier || '',
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      displayName: user?.displayName || '',
      isAdmin: user?.isAdmin || false,
    });
  }, [reset, user]);
  useEffect(() => {
    if (userid) {
      doLoadUser();
    }
  }, [userid, doLoadUser]);
  useEffect(() => {
    doLoadData();
  }, [doLoadData]);
  useEffect(() => {
    if (!isAuthenticated || (isAuthenticated && !isAdmin)) {
      navigate('/');
    }
  }, [navigate, isAuthenticated, isAdmin]);
  useEffect(() => {
    if (user) {
      doReset();
    }
  }, [user, doReset]);

  async function doSubmitForm(data: FormData) {
    const model: IChangeProfileModel = {
      email: data.email,
      identifier: data.identifier,
      firstName: data.firstName,
      lastName: data.lastName,
      displayName: data.displayName,
    };
    const response = await updateUserModel(
      model,
      await getAccessTokenSilently(),
    );
    console.dir(response);
    if (response && response.ok) {
      setAlert('Profile updated successfully', 'info');
      return;
    } else if (response && response.body) {
      const r = response.body as IApiResponse;
      if (r && r.message) {
        setAlert(r.message, 'error', 5000);
        return;
      }
    }
    setAlert(
      `An unexpected error occurred (${response?.code || 0})`,
      'error',
      5000,
    );
  }

  async function doToggleAdmin() {
    if (user && user.id) {
      const response = await toggleAdmin(
        user.id,
        await getAccessTokenSilently(),
      );
      if (isSuccessResult(response)) {
        user.isAdmin = !user.isAdmin;
        setAlert('Admin toggled successfully', 'info');
        return;
      }
      setAlert(response.message, 'error', 5000);
    }
  }

  function noticeDetailsClick(id: string) {
    const notice = notices.find((x) => x.id === id);
    if (notice) {
      setSelectedNotice(notice);
      if (!notice_modal) {
        notice_modal = document.getElementById('detp__noticemodal');
      }
      // @ts-ignore
      notice_modal.showModal();
    }
  }

  function dismissNoticeModal() {
    // @ts-ignore
    notice_modal.close();
  }

  function formatDate(date: Date): string {
    const year = date.getFullYear();
    if (year >= 2000 && year !== 9999) {
      return date.toLocaleDateString();
    }
    return 'n/a';
  }

  function status(text: string) {
    setStatusText(text || ' ');
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
      <dialog className="modal detp__noticemodal" id="detp__noticemodal">
        <div className="detp__nm__content">
          <div className="detp__nm__heading">{selectedNotice?.title}</div>
          <div className="detp__nm__body">{selectedNotice?.text}</div>
          <div className="buttoncontainer">
            <button className="primarybutton" onClick={dismissNoticeModal}>
              <span>
                <MdCheck /> Ok
              </span>
            </button>
          </div>
          {selectedNotice && (
            <>
              <div className="detp__nm__date">
                {new Date(selectedNotice!.noticeDate).toLocaleDateString()}
              </div>
              <div className="detp__nm__read">
                {selectedNotice.read && <span>Read</span>}
                {!selectedNotice.read && <span>Unread</span>}
              </div>
            </>
          )}
        </div>
      </dialog>
      <PageHeader
        heading="Details"
        showHomeButton={true}
        secondButton={
          <button
            className="secondarybutton headerbutton-right"
            onClick={() => navigate('/Admin')}
          >
            <span>
              <MdArrowBack /> Back
            </span>
          </button>
        }
      />
      <div className="content">
        <div className="detp__usercontainer">
          <GroupBox label="User Information">
            <form
              className="detp__userform"
              onSubmit={handleSubmit(doSubmitForm)}
            >
              <input type="hidden" value={user.identifier} />
              <input type="hidden" value={user.email} />
              <div className="formitem">
                <label className="formlabel">Identifier</label>
                <div className="formitem">{user.identifier}</div>
              </div>
              <div className="formitem">
                <label className="formlabel" htmlFor="email">
                  Email
                </label>
                <div className="forminput">{user.email}</div>
              </div>
              <div className="formitem">
                <label className="formlabel" htmlFor="firstName">
                  First&nbsp;Name
                </label>
                <input
                  type="text"
                  className="forminput"
                  {...register('firstName')}
                  id="firstName"
                  placeholder="First Name"
                />
              </div>
              <div className="formitem">
                <label className="formlabel" htmlFor="lastName">
                  Last&nbsp;Name
                </label>
                <input
                  type="text"
                  className="forminput"
                  {...register('lastName')}
                  id="lastName"
                  placeholder="Last Name"
                />
              </div>
              <div className="formitem">
                <label className="formlabel" htmlFor="display">
                  Display
                </label>
                <input
                  type="text"
                  className="forminput"
                  {...register('displayName')}
                  id="display"
                  placeholder="Display Name"
                />
              </div>
              <div className="formitem">
                <label className="formlabel">Date&nbsp;Joined</label>
                <div className="forminput">
                  {new Date(user.dateJoined).toLocaleDateString()}
                </div>
              </div>
              <div className="formitem">
                <label className="formlabel">Balance</label>
                <div className="forminput">{toCurrency(user.balance)}</div>
              </div>
              <div className="formitem">
                <label className="formlabel">Admin</label>
                <div className="forminput">
                  {user?.isAdmin && (
                    <div>
                      <MdCheck />
                    </div>
                  )}
                  {!user?.isAdmin && (
                    <div>
                      <MdCancel />
                    </div>
                  )}
                </div>
              </div>
              <div className="buttoncontainer">
                <button type="submit" className="primarybutton">
                  <span>
                    <MdSave /> Save
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
                <button
                  type="button"
                  className="secondarybutton"
                  onClick={doToggleAdmin}
                >
                  {user.isAdmin && (
                    <span>
                      <FaUser /> Demote
                    </span>
                  )}
                  {!user.isAdmin && (
                    <span>
                      <FaUserSecret /> Promote
                    </span>
                  )}
                </button>
              </div>
            </form>
          </GroupBox>
        </div>
        <div className="detp__datacontainer">
          <GroupBox label="Site Data">
            <>
              <div className="detp__datastatus">
                {statusText && <span>{statusText}</span>}
                {!statusText && <span>&nbsp;</span>}
              </div>
              <HideWidget label="Holdings" content="User Holdings">
                {holdings && holdings.length > 0 && (
                  <div className="detp__holdingscontainer">
                    {holdings.map((x) => (
                      <div className="detp__hc__holding" key={x.id}>
                        <div
                          className="detp__hc__h__date"
                          onMouseEnter={() => status('Purchase Date')}
                          onMouseLeave={() => status('')}
                        >
                          {new Date(x.purchaseDate).toLocaleDateString()}
                        </div>
                        <div
                          className="detp__hc__h__bean"
                          onMouseEnter={() => status('Bean Name')}
                          onMouseLeave={() => status('')}
                        >
                          {x.bean?.name || 'Unknown'}
                        </div>
                        <div
                          className="detp__hc__h__quantity detp__pullright"
                          onMouseEnter={() => status('Quantity')}
                          onMouseLeave={() => status('')}
                        >
                          {x.quantity}
                        </div>
                        <div
                          className="detp__hc__h__price detp__pullright"
                          onMouseEnter={() => status('Purchase Price')}
                          onMouseLeave={() => status('')}
                        >
                          {toCurrency(x.price)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </HideWidget>
              <HideWidget label="Notices" content="User Notices">
                {notices && notices.length > 0 && (
                  <div className="detp__noticescontainer">
                    {notices.map((x) => (
                      <div
                        className="detp__nc__notice"
                        key={x.id}
                        id={`notice-${x.id}`}
                        onClick={() => noticeDetailsClick(x.id)}
                      >
                        <div
                          className="detp__nc__n__date"
                          onMouseEnter={() => status('Notice Date')}
                          onMouseLeave={() => status('')}
                        >
                          {new Date(x.noticeDate).toLocaleDateString()}
                        </div>
                        <div
                          className="detp__nc__n__sender"
                          onMouseEnter={() => status('Sender')}
                          onMouseLeave={() => status('')}
                        >
                          {x.senderIsExchange && <span>Exchange</span>}
                          {x.senderIsSystem && <span>System</span>}
                          {!x.senderIsExchange && !x.senderIsSystem && (
                            <span>{x.sender?.displayName || 'Unknown'}</span>
                          )}
                        </div>
                        <div
                          className="detp__nc__n__title"
                          title={x.title}
                          onMouseEnter={() => status('Notice Title')}
                          onMouseLeave={() => status('')}
                        >
                          {x.title}
                        </div>
                        {x.read && (
                          <div
                            className="detp__nc__n__read"
                            title="Notice has been read"
                            onMouseEnter={() => status('Read Status')}
                            onMouseLeave={() => status('')}
                          >
                            <MdCheck />
                          </div>
                        )}
                        {!x.read && (
                          <div
                            className="detp__nc__n__read"
                            title="Notice has not been read"
                            onMouseEnter={() => status('Read Status')}
                            onMouseLeave={() => status('')}
                          >
                            <MdCancel />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </HideWidget>
              <HideWidget label="Offers" content="User Offers">
                {offers && offers.length > 0 && (
                  <div className="detp__offerscontainer">
                    {offers.map((x) => (
                      <div className="detp__oc__offer" key={x.id}>
                        <div
                          className="detp__oc__o__date"
                          onMouseEnter={() => status('Offer Date')}
                          onMouseLeave={() => status('')}
                        >
                          {new Date(x.offerDate).toLocaleDateString()}
                        </div>
                        {x.buy && (
                          <div
                            className="detp__oc__o__buysell"
                            onMouseEnter={() => status('Buy/Sell')}
                            onMouseLeave={() => status('')}
                          >
                            Buy
                          </div>
                        )}
                        {!x.buy && (
                          <div
                            className="detp__oc__o__buysell"
                            onMouseEnter={() => status('Buy/Sell')}
                            onMouseLeave={() => status('')}
                          >
                            Sell
                          </div>
                        )}
                        <div
                          className="detp__oc__o__quantity detp__pullright"
                          onMouseEnter={() => status('Quantity')}
                          onMouseLeave={() => status('')}
                        >
                          {x.quantity}
                        </div>
                        <div
                          className="detp__oc__o__bean"
                          onMouseEnter={() => status('Bean Name')}
                          onMouseLeave={() => status('')}
                        >
                          {x.bean?.name || 'unknown'}
                        </div>
                        <div
                          className="detp__oc__o__price detp__pullright"
                          onMouseEnter={() => status('Price')}
                          onMouseLeave={() => status('')}
                        >
                          {toCurrency(x.price)}
                        </div>
                        {!x.buy && x.holding && (
                          <div
                            className="detp__oc__o__holdingdate"
                            onMouseEnter={() => status('Holding Date')}
                            onMouseLeave={() => status('')}
                          >
                            {new Date(
                              x.holding.purchaseDate,
                            ).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </HideWidget>
              <HideWidget label="Sales" content="User Sales">
                {sales && sales.length > 0 && (
                  <div className="detp__salescontainer">
                    {sales.map((x) => (
                      <div className="detp__sc__sale" key={x.id}>
                        <div
                          className="detp__sc__s__bean"
                          onMouseEnter={() => status('Bean Name')}
                          onMouseLeave={() => status('')}
                        >
                          {x.bean?.name || 'unknown'}
                        </div>
                        <div
                          className="detp__sc__s__purchase"
                          onMouseEnter={() => status('Purchase Date')}
                          onMouseLeave={() => status('')}
                        >
                          {formatDate(new Date(x.purchaseDate))}
                        </div>
                        <div
                          className="detp__sc__s__sale"
                          onMouseEnter={() => status('Sale Date')}
                          onMouseLeave={() => status('')}
                        >
                          {formatDate(new Date(x.saleDate))}
                        </div>
                        <div
                          className="detp__sc__s__quantity detp__pullright"
                          onMouseEnter={() => status('Quantity')}
                          onMouseLeave={() => status('')}
                        >
                          {x.quantity}
                        </div>
                        <div
                          className="detp__sc__s__basis detp__pullright"
                          onMouseEnter={() => status('Cost Basis')}
                          onMouseLeave={() => status('')}
                        >
                          {toCurrency(x.costBasis)}
                        </div>
                        <div
                          className="detp__sc__s__price detp__pullright"
                          onMouseEnter={() => status('Sale Price')}
                          onMouseLeave={() => status('')}
                        >
                          {toCurrency(x.salePrice)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </HideWidget>
            </>
          </GroupBox>
        </div>
      </div>
    </div>
  );
}
