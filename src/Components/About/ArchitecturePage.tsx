import { useNavigate } from 'react-router-dom';
import { TiInfoLarge } from 'react-icons/ti';
import PageHeader from '../Widgets/Page/PageHeader';
import './ArchitecturePage.css';

export default function ArchitecturePage() {
  const navigate = useNavigate();
  return (
    <div className="container">
      <PageHeader
        heading="Architecture"
        showHomeButton={true}
        secondButton={
          <button
            className="secondarybutton headerbutton-right"
            onClick={() => navigate('/About')}
          >
            <span>
              <TiInfoLarge /> Back
            </span>
          </button>
        }
      />
      <div className="content">
        <img
          src="/images/BeansArchitecture.png"
          width={900}
          className="arch__centerimage"
          alt="Architecture Diagram"
        />
      </div>
    </div>
  );
}
