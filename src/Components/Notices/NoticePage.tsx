import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useUser } from '../../Contexts/UserContext';
import { useAlert } from '../../Contexts/AlertContext';
import { useNotice } from '../../Contexts/NoticeCountContext';
import { INoticeModel } from '../../Interfaces/INoticeModel';
import {
  deleteNotice,
  getNotices,
  markRead,
} from '../../Services/NoticeService';
import { isSuccessResult } from '../../Interfaces/IApiResponse';
import NoticeWidget from '../Widgets/Notice/NoticeWidget';
import PageHeader from '../Widgets/Page/PageHeader';
import Spinner from '../Widgets/Spinner/Spinner';
import './NoticePage.css';

export default function NoticePage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [notices, setNotices] = useState<INoticeModel[]>([]);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const { user } = useUser();
  const { setAlert } = useAlert();
  const { updateUnread } = useNotice();
  const navigate = useNavigate();
  const doLoadNotices = useCallback(async () => {
    if (user) {
      setLoading(true);
      const response = await getNotices(
        user.id,
        await getAccessTokenSilently(),
      );
      setNotices(response);
      setLoading(false);
    }
  }, [user, getAccessTokenSilently]);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  useEffect(() => {
    doLoadNotices();
  }, [user, doLoadNotices]);

  async function noticeRead(notice: INoticeModel) {
    const response = await markRead(notice.id, await getAccessTokenSilently());
    if (isSuccessResult(response)) {
      notice.read = true;
      setAlert('Notice marked read', 'info');
      updateUnread();
      return;
    }
    setAlert(response.message, 'error', 5000);
  }
  async function deleteNoticeClicked(notice: INoticeModel) {
    const response = await deleteNotice(
      notice.id,
      await getAccessTokenSilently(),
    );
    if (isSuccessResult(response)) {
      await doLoadNotices();
      setAlert('Notice deleted successfully', 'info');
      return;
    }
    setAlert(response.message, 'error', 5000);
  }

  if (loading || !user) {
    return (
      <div className={'loading'}>
        <Spinner /> Loading...
      </div>
    );
  }
  return (
    <div className="container">
      <PageHeader heading="Notices" showHomeButton={true} />
      <div className={'content'}>
        {(!notices || notices.length === 0) && (
          <div className={'noitemsfound'}>You have no notices</div>
        )}
        {notices && notices.length > 0 && (
          <div className={'np__noticecontainer'}></div>
        )}
        {notices &&
          notices.length > 0 &&
          notices.map((x) => (
            <NoticeWidget
              notice={x}
              readHandler={noticeRead}
              delHandler={deleteNoticeClicked}
              key={x.id}
            />
          ))}
      </div>
    </div>
  );
}
