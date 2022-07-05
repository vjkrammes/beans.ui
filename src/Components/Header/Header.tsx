import { Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useNotice } from '../../Contexts/NoticeCountContext';
import {
  MdAccountBalance,
  MdLogin,
  MdLogout,
  MdMoney,
  MdOutlineStickyNote2,
  MdSettings,
  MdLeaderboard,
  MdOutlineAccountBox,
} from 'react-icons/md';
import { FaExchangeAlt, FaUserSecret } from 'react-icons/fa';
import { useUser } from '../../Contexts/UserContext';
import RoleBadge from '../Widgets/Badges/RoleBadge';
import Spinner from '../Widgets/Spinner/Spinner';
import './Header.css';

export default function Header() {
  const { isValid, user, isAdmin } = useUser();
  const { isLoading, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const { unread } = useNotice();
  const navigate = useNavigate();
  return (
    <div className="h__container">
      <Link to="/" className="h__logo">
        <img
          className="h__logoimage"
          src="/images/beanslogo64.png"
          alt="Beans Logo"
        />
      </Link>
      <div className="h__welcome">Welcome to the Beans Trading Application</div>
      <div className="h__linkcontainer">
        {isLoading && (
          <span>
            <Spinner /> Loading ...
          </span>
        )}
        {!isLoading && isAuthenticated && !isValid && (
          <span>
            <Spinner /> Loading&nbsp;User ...
          </span>
        )}
        {!isLoading &&
          (isValid && isAuthenticated ? (
            <div className="h__buttoncontainer">
              {unread > 0 && (
                <div
                  className="e-badge e-badge-primary"
                  title="You have unread notices"
                >
                  {unread}
                </div>
              )}
              <RoleBadge />
              <div className="h__name">{user?.displayName}</div>
              <button
                type="button"
                className="headerfooterbutton"
                onClick={() => navigate('/Profile')}
              >
                <span>
                  <MdSettings /> Profile
                </span>
              </button>
              <button
                type="button"
                className="headerfooterbutton"
                onClick={() => logout({ returnTo: window.location.origin })}
              >
                <span>
                  <MdLogout /> Sign&nbsp;Out
                </span>
              </button>
            </div>
          ) : (
            <div className="h__buttoncontainer">
              <button
                type="button"
                className="headerfooterbutton"
                onClick={loginWithRedirect}
              >
                <span>
                  <MdLogin /> Sign&nbsp;In
                </span>
              </button>
            </div>
          ))}
      </div>
      {isAuthenticated && (
        <>
          <div className="h__smallbuttoncontainer">
            <button
              type="button"
              className="squarebutton"
              onClick={() => navigate('/Account')}
            >
              <span>
                <MdOutlineAccountBox />
              </span>
            </button>
            <button
              type="button"
              className="squarebutton"
              onClick={() => navigate('/Holdings')}
            >
              <span>
                <MdAccountBalance />
              </span>
            </button>
            <button
              type="button"
              className="squarebutton"
              onClick={() => navigate('/Exchange')}
            >
              <span>
                <MdMoney />
              </span>
            </button>
            <button
              type="button"
              className="squarebutton"
              onClick={() => navigate('/Trade')}
            >
              <span>
                <FaExchangeAlt />
              </span>
            </button>
            <button
              type="button"
              className="squarebutton"
              onClick={() => navigate('/Scores')}
            >
              <span>
                <MdLeaderboard />
              </span>
            </button>
            <button
              type="button"
              className="squarebutton"
              onClick={() => navigate('/Notices')}
            >
              <span>
                <MdOutlineStickyNote2 />
              </span>
            </button>
            {isAdmin && (
              <button
                type="button"
                className="squarebutton"
                onClick={() => navigate('/Admin')}
              >
                <span>
                  <FaUserSecret />
                </span>
              </button>
            )}
          </div>
          <div className="h__largebuttoncontainer">
            <button
              type="button"
              className="headerfooterbutton"
              onClick={() => navigate('/Account')}
            >
              <span>
                <MdOutlineAccountBox /> Account
              </span>
            </button>
            <button
              type="button"
              className="headerfooterbutton"
              onClick={() => navigate('/Holdings')}
            >
              <span>
                <MdAccountBalance /> Holdings
              </span>
            </button>
            <button
              type="button"
              className="headerfooterbutton"
              onClick={() => navigate('/Exchange')}
            >
              <span>
                <MdMoney /> Exchange
              </span>
            </button>
            <button
              type="button"
              className="headerfooterbutton"
              onClick={() => navigate('/Trade')}
            >
              <span>
                <FaExchangeAlt /> Trade
              </span>
            </button>
            <button
              type="button"
              className="headerfooterbutton"
              onClick={() => navigate('/Scores')}
            >
              <span>
                <MdLeaderboard /> Scores
              </span>
            </button>
            <button
              type="button"
              className="headerfooterbutton"
              onClick={() => navigate('/Notices')}
            >
              <span>
                <MdOutlineStickyNote2 /> Notices
              </span>
            </button>
            {isAdmin && (
              <button
                type="button"
                className="headerfooterbutton"
                onClick={() => navigate('/Admin')}
              >
                <span>
                  <FaUserSecret /> Admin
                </span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
