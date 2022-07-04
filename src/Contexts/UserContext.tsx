import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useSettings } from './SettingsContext';
import { IUserModel } from '../Interfaces/IUserModel';
import { GetUserModel } from '../Services/UserService';

type UserContextType = {
  isValid: boolean;
  user: IUserModel | null;
  isAdmin: boolean;
};

const UserContext = createContext<UserContextType>({
  isValid: false,
  user: null,
  isAdmin: false,
});

type Props = {
  children: JSX.Element;
};

export const UserProvider = ({ children }: Props) => {
  const {
    isLoading,
    isAuthenticated,
    user: Auth0User,
    getAccessTokenSilently,
  } = useAuth0();
  const [isValid, setIsValid] = useState<boolean>(false);
  const [user, setUser] = useState<IUserModel | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { startingBalance } = useSettings();
  useEffect(() => {
    async function getUser() {
      if (!isLoading && isAuthenticated && Auth0User) {
        const identifier = Auth0User.sub;
        const email = Auth0User.email;
        if (identifier && email) {
          const user = await GetUserModel(
            email,
            identifier,
            startingBalance,
            await getAccessTokenSilently(),
          );
          if (user) {
            setUser(user);
            setIsAdmin(user.isAdmin);
            setIsValid(true);
          } else {
            console.error("Failed to load user with email '" + email + "'");
          }
        }
      }
    }

    getUser();
  }, [
    isLoading,
    isAuthenticated,
    Auth0User,
    getAccessTokenSilently,
    startingBalance,
  ]);
  // const doGetUser = useCallback(async () => {
  //   if (!isLoading && isAuthenticated && Auth0User) {
  //     const identifier = Auth0User.sub;
  //     const email = Auth0User.email;
  //     if (identifier && email) {
  //       const dbuser = await GetUserModel(
  //         email,
  //         identifier,
  //         startingBalance,
  //         await getAccessTokenSilently(),
  //       );
  //       if (dbuser) {
  //         console.dir(dbuser);
  //         setUser(dbuser);
  //         setIsAdmin(dbuser.isAdmin);
  //         setIsValid(true);
  //       } else {
  //         console.error(
  //           "Failed to retrieve user with email '" +
  //             email +
  //             "' and identifier '" +
  //             identifier +
  //             "'",
  //         );
  //       }
  //     }
  //   }
  // }, [
  //   isLoading,
  //   isAuthenticated,
  //   Auth0User,
  //   getAccessTokenSilently,
  //   startingBalance,
  // ]);
  // useEffect(() => {
  //   doGetUser();
  // }, [doGetUser]);
  return (
    <UserContext.Provider
      value={{
        isValid: isValid,
        user: user,
        isAdmin: isAdmin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserContext;
