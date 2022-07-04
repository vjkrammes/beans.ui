import PageHeader from '../Widgets/Page/PageHeader';
import './FatalPage.css';

export default function FatalPage() {
  return (
    <div className="container">
      <PageHeader heading="Fatal Error" showHomeButton={false} />
      <div className="content fp__content">
        <div className="fp__message">
          We apologize, but an irrecoverable network error has occurred.
        </div>
      </div>
    </div>
  );
}
