import {IBeanModel} from './IBeanModel';

export interface ISaleModel {
  id: string;
  userId: string;
  beanId: string;
  purchaseDate: Date;
  saleDate: Date;
  longTerm: boolean;
  quantity: number;
  costBasis: number;
  salePrice: number;
  bean?: IBeanModel;
}
