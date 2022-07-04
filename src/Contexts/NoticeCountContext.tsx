import {
  createContext,
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
} from 'react';
import { getUnreadNoticeCount } from '../Services/NoticeService';
import { useUser } from './UserContext';

type NoticeContextType = {
  unread: number;
  updateUnread: () => void;
  setUnread: Dispatch<SetStateAction<number>>;
};

const NoticeContext = createContext<NoticeContextType>({
  unread: 0,
  updateUnread: () => {},
  setUnread: () => {},
});

type Props = {
  children: JSX.Element;
};

export const NoticeProvider = ({ children }: Props) => {
  const [unread, setUnread] = useState<number>(0);
  const { user } = useUser();
  const doGetCount = useCallback(async () => {
    let c = 0;
    if (user) {
      const response = await getUnreadNoticeCount(user.id);
      c = response;
    }
    setUnread(c);
  }, [user]);
  useEffect(() => {
    doGetCount();
  }, [doGetCount]);
  async function updateCount() {
    await doGetCount();
  }
  return (
    <NoticeContext.Provider
      value={{
        unread: unread,
        updateUnread: updateCount,
        setUnread: setUnread,
      }}
    >
      {children}
    </NoticeContext.Provider>
  );
};

export const useNotice = () => useContext(NoticeContext);

export default NoticeContext;
