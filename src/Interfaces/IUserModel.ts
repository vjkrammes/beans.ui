export interface IUserModel {
  id: string;
  identifier: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  balance: number;
  owedToExchange: number;
  dateJoined: string;
  isAdmin: boolean;
}
