import {MdHome} from 'react-icons/md';
import {useNavigate} from 'react-router-dom';
import './NotFoundPage.css';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="content">
        <p className="nfp__text">
          We're sorry, but the page or item you are looking for cannot be
          located. Click the Home button below to return to the main page.
        </p>
        <button className="primarybutton" onClick={() => navigate('/')}>
          <span>
            <MdHome/> Home
          </span>
        </button>
      </div>
    </div>
  );
}
