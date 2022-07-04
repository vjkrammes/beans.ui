import {IBeanModel} from './IBeanModel';

export interface IHoldingModel {
  id: string;
  userId: string;
  beanId: string;
  purchaseDate: Date;
  quantity: number;
  price: number;
  bean?: IBeanModel;
}
