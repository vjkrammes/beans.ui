import {useNavigate} from 'react-router-dom';
import {TiInfoLarge} from 'react-icons/ti';
import {MdOutlinePrivacyTip} from 'react-icons/md';
import './Footer.css';

export default function Footer() {
  const navigate = useNavigate();
  return (
    <div className="f__container">
      <button
        className="headerfooterbutton"
        type="button"
        onClick={() => navigate('/Privacy')}
      >
        <span>
          <MdOutlinePrivacyTip/> Privacy
        </span>
      </button>
      <div className="f__copyright">
        ©&nbsp;Copyright 2019-2022 VJK Solutions, LLC. All Rights Reserved.
      </div>
      <button
        className="headerfooterbutton"
        type="button"
        onClick={() => navigate('/About')}
      >
        <span>
          <TiInfoLarge/> About
        </span>
      </button>
    </div>
  );
}
