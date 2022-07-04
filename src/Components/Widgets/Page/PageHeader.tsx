import { MdHome } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

type Props = {
  heading: JSX.Element | string;
  showHomeButton: boolean;
  secondButton?: JSX.Element;
};

export default function PageHeader({
  heading,
  showHomeButton,
  secondButton,
}: Props) {
  const navigate = useNavigate();
  return (
    <div className="header">
      <>
        <div className="heading">{heading}</div>
        {showHomeButton && (
          <button
            className="primarybutton headerbutton-left"
            onClick={() => navigate('/')}
          >
            <span>
              <MdHome /> Home
            </span>
          </button>
        )}
        {secondButton && <>{secondButton}</>}
      </>
    </div>
  );
}
