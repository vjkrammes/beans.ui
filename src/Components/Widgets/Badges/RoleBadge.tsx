import {useUser} from '../../../Contexts/UserContext';
import {FaUser, FaUserSecret} from 'react-icons/fa';
import './RoleBadge.css';

export default function RoleBadge() {
  const {isValid, isAdmin, user} = useUser();
  if (!isValid) {
    return <></>;
  }
  return (
    <div className="rb__container">
      {!isAdmin && <FaUser title={`User ${user?.email} is not an admin`}/>}
      {isAdmin && <FaUserSecret title={`User ${user?.email} is an admin`}/>}
    </div>
  );
}
