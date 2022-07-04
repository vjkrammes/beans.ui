import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../Contexts/UserContext';
import { useAlert } from '../../Contexts/AlertContext';
import { useSettings } from '../../Contexts/SettingsContext';
import { MdCancel, MdCheck, MdClear, MdInfo } from 'react-icons/md';
import { getUsers, resetUsers } from '../../Services/UserService';
import { resetHoldings } from '../../Services/HoldingService';
import { toCurrency } from '../../Services/tools';
import { IUserModel } from '../../Interfaces/IUserModel';
import GroupBox from '../Widgets/GroupBox/GroupBox';
import PageHeader from '../Widgets/Page/PageHeader';
import './AdminPage.css';
import { isSuccessResult } from '../../Interfaces/IApiResponse';

export default function AdminPage() {
  const [users, setUsers] = useState<IUserModel[]>([]);
  const [userAck, setUserAck] = useState<boolean>(false);
  const [holdingAck, setHoldingAck] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<IUserModel | null>(null);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const { isAdmin } = useUser();
  const { setAlert } = useAlert();
  const { startingBalance } = useSettings();
  const navigate = useNavigate();
  const doLoadUsers = useCallback(async () => {
    let u: IUserModel[] = [];
    u = await getUsers();
    setUsers(u);
  }, []);
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);
  useEffect(() => {
    doLoadUsers();
  }, [doLoadUsers]);

  function userChanged(e: ChangeEvent<HTMLSelectElement>) {
    if (e && e.target && e.target.value) {
      const u = users.find((x) => x.id === e.target.value);
      if (u) {
        setSelectedUser(u);
        return;
      }
    }
    setSelectedUser(null);
  }

  function userAckChanged(e: ChangeEvent<HTMLInputElement>) {
    setUserAck(!userAck);
  }

  function holdingAckChanged(e: ChangeEvent<HTMLInputElement>) {
    setHoldingAck(!holdingAck);
  }

  async function doResetUsers() {
    setUserAck(false);
    const response = await resetUsers(await getAccessTokenSilently());
    if (isSuccessResult(response)) {
      setAlert('Users Reset Successfully', 'info');
    } else {
      setAlert(response.message, 'error', 5000);
    }
  }

  async function doResetHoldings() {
    setHoldingAck(false);
    const response = await resetHoldings(await getAccessTokenSilently());
    if (isSuccessResult(response)) {
      setAlert('Holdings Reset Successfully', 'info');
    } else {
      setAlert(response.message, 'error', 5000);
    }
  }

  return (
    <div className="container">
      <PageHeader heading="Admin" showHomeButton={true} />
      <div className="content">
        <div className="ap__userscontainer ap__bordered">
          <div className="ap__usersheader">User Information</div>
          <div className="ap__u__selectcontainer">
            <select value={selectedUser?.id || '0'} onChange={userChanged}>
              <option key="0" value="0">
                Select a User
              </option>
              {users &&
                users.length > 0 &&
                users.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.displayName}
                  </option>
                ))}
            </select>
            <button
              type="button"
              className="primarybutton"
              onClick={() => navigate(`/Details/${selectedUser?.id}`)}
              disabled={!selectedUser}
            >
              <span>
                <MdInfo /> Details
              </span>
            </button>
          </div>
          <div className="ap__u__infoblock">
            <div className="ap__u__item">
              <div className="ap__u__ib__label">Identifier</div>
              <div
                className="ap__u__ib__value ap__truncate"
                title={selectedUser?.identifier}
              >
                {selectedUser?.identifier || ''}
              </div>
            </div>
            <div className="ap__u__item">
              <div className="ap__u__ib__label">Email</div>
              <div
                className="ap__u__ib__value ap__truncate"
                title={selectedUser?.email}
              >
                {selectedUser?.email || ''}
              </div>
            </div>
            <div className="ap__u__item">
              <div className="ap__u__ib__label">First&nbsp;Name</div>
              <div
                className="ap__u__ib__value ap__truncate"
                title={selectedUser?.firstName}
              >
                {selectedUser?.firstName || ''}
              </div>
            </div>
            <div className="ap__u__item">
              <div className="ap__u__ib__label">Last&nbsp;Name</div>
              <div
                className="ap__u__ib__value ap__truncate"
                title={selectedUser?.lastName}
              >
                {selectedUser?.lastName || ''}
              </div>
            </div>
            <div className="ap__u__item">
              <div className="ap__u__ib__label">Display</div>
              <div
                className="ap__u__ib__value ap__truncate"
                title={selectedUser?.displayName}
              >
                {selectedUser?.displayName || ''}
              </div>
            </div>
            <div className="ap__u__item">
              <div className="ap__u__ib__label">Balance</div>
              <div className="ap__u__ib__value">
                {selectedUser?.balance ? toCurrency(selectedUser.balance) : ''}
              </div>
            </div>
            <div className="ap__u__item">
              <div className="ap__u__ib__label">Owed</div>
              <div className="ap__u__ib__value">
                {selectedUser?.owedToExchange
                  ? toCurrency(selectedUser.owedToExchange)
                  : ''}
              </div>
            </div>
            <div className="ap__u__item">
              <div className="ap__u__ib__label">Date&nbsp;Joined</div>
              <div className="ap__u__ib__value">
                {selectedUser
                  ? new Date(selectedUser.dateJoined).toLocaleDateString()
                  : ''}
              </div>
            </div>
            <div className="ap__u__item">
              <div className="ap__u__ib__label">Admin</div>
              <div className="ap__u__ib__value">
                {selectedUser === null ? (
                  ''
                ) : selectedUser?.isAdmin ? (
                  <MdCheck />
                ) : (
                  <MdCancel />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="ap__resetcontainer ap__bordered">
          <div className="ap__dangerheader">Danger Zone</div>
          <div className="ap__dangerblock">
            <GroupBox label="Reset All Holdings">
              <>
                <div className="ap__db__text">
                  This will delete all holdings, return all beans back to the
                  Exchange, delete all sales, offers, and notices. The prices of
                  beans and movement history will not be deleted.
                </div>
                <div className="ap__db__bottom">
                  <label htmlFor="holdingAck" className="ap__db__ack">
                    <input
                      type="checkbox"
                      checked={holdingAck}
                      onChange={holdingAckChanged}
                      id="holdingAck"
                    />{' '}
                    Acknowledged
                  </label>
                  <button
                    className="primarybutton dangerbutton ap__db__resetbutton"
                    type="button"
                    onClick={doResetHoldings}
                    disabled={!holdingAck}
                  >
                    <span>
                      <MdClear /> Reset&nbsp;Holdings
                    </span>
                  </button>
                </div>
              </>
            </GroupBox>
            <GroupBox label="Reset User Balances">
              <>
                <div className="ap__db__text">
                  This will reset all user balances back to the configured
                  starting balance ({toCurrency(startingBalance)}) and reset all
                  loan balances to zero.
                </div>
                <div className="ap__db__bottom">
                  <label htmlFor="userAck" className="ap__db__ack">
                    <input
                      type="checkbox"
                      checked={userAck}
                      onChange={userAckChanged}
                      id="userAck"
                    />{' '}
                    Acknowledged
                  </label>
                  <button
                    className="primarybutton dangerbutton ap__db__resetbutton"
                    type="button"
                    onClick={doResetUsers}
                    disabled={!userAck}
                  >
                    <span>
                      <MdClear /> Reset&nbsp;Users
                    </span>
                  </button>
                </div>
              </>
            </GroupBox>
          </div>
        </div>
      </div>
    </div>
  );
}
