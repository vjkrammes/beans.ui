import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth0 } from '@auth0/auth0-react';
import { useUser } from '../../Contexts/UserContext';
import { useAlert } from '../../Contexts/AlertContext';
import { MdLogout, MdSave } from 'react-icons/md';
import { IChangeProfileModel } from '../../Interfaces/IChangeProfileModel';
import { IApiResponse } from '../../Interfaces/IApiResponse';
import { updateUserModel } from '../../Services/UserService';
import PageHeader from '../Widgets/Page/PageHeader';
import './ProfilePage.css';

type FormData = {
  firstName: string;
  lastName: string;
  displayName: string;
};

export default function ProfilePage() {
  const { isAuthenticated, getAccessTokenSilently, logout } = useAuth0();
  const { user } = useUser();
  const { setAlert } = useAlert();
  const navigate = useNavigate();
  let modal = document.getElementById('prof__modal');
  const { register, handleSubmit, reset } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      displayName: '',
    },
  });
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [navigate, isAuthenticated]);
  useEffect(() => {
    reset({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      displayName: user?.displayName || '',
    });
  }, [reset, user]);

  async function doSave(data: FormData) {
    const model: IChangeProfileModel = {
      ...data,
      identifier: user!.identifier,
      email: user!.email,
    };
    const response = await updateUserModel(
      model,
      await getAccessTokenSilently(),
    );
    if (response && response.ok) {
      if (!modal) {
        modal = document.getElementById('prof__modal');
      }
      // @ts-ignore
      modal.showModal();
      setAlert('Profile Updated Successfully', 'info');
    } else if (response && response.body) {
      setAlert((response.body as IApiResponse).message, 'error', 5000);
    } else {
      setAlert(`Unexpected error occurred (${response.code})`, 'error', 5000);
    }
  }

  function doLogout() {
    // @ts-ignore
    modal.close();
    logout({ returnTo: window.location.origin });
    navigate('/');
  }

  return (
    <div className="container">
      <PageHeader heading="Profile" showHomeButton={true} />
      <div className="content">
        <dialog className="modal prof__modal" id="prof__modal">
          <div className="prof__modalcontainer">
            <div className="prof__modalheading">
              Your profile has been updated
            </div>
            <div className="prof__modalmessage">
              Please sign out to complete the update.
            </div>
            <button type="button" className="primarybutton" onClick={doLogout}>
              <span>
                <MdLogout /> Sign&nbsp;Out
              </span>
            </button>
          </div>
        </dialog>
        <form
          onSubmit={handleSubmit(doSave)}
          className="form-outline prof__editform"
        >
          <div className="formitem prof__headitem">
            <div className="formlabel">Email</div>
            <div className="forminput prof__email">{user?.email}</div>
          </div>
          <div className="formitem">
            <label className="formlabel" htmlFor="firstName">
              First&nbsp;Name
            </label>
            <input
              className="forminput"
              id="firstName"
              {...register('firstName')}
              placeholder="First Name"
              autoFocus
            />
          </div>
          <div className="formitem">
            <label className="formlabel" htmlFor="lastName">
              Last&nbsp;Name
            </label>
            <input
              className="forminput"
              id="lastName"
              {...register('lastName')}
              placeholder="Last Name"
            />
          </div>
          <div className="formitem">
            <label className="formlabel" htmlFor="displayName">
              Display&nbsp;Name
            </label>
            <input
              className="forminput"
              id="displayName"
              {...register('displayName')}
              placeholder="Display Name"
            />
          </div>
          <div className="buttoncontainer">
            <button className="primarybutton" type="submit">
              <span>
                <MdSave /> Save
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
