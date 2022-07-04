import { IBeanModel } from './IBeanModel';
import { IHoldingModel } from './IHoldingModel';
import { IUserModel } from './IUserModel';

export interface IOfferModel {
  id: string;
  userId: string;
  beanId: string;
  holdingId: string;
  quantity: number;
  price: number;
  buy: boolean;
  offerDate: Date;
  bean?: IBeanModel;
  user?: IUserModel;
  holding?: IHoldingModel;
}
