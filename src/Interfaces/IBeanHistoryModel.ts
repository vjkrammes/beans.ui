import {ICostBasis} from './ICostBasis';
import {IMovementModel} from './IMovementModel';
import {IPriceHistory} from './IPriceHistory';

export interface IBeanHistoryModel {
  beanId: string;
  beanName: string;
  imageName: string;
  price: number;
  costBasis: ICostBasis;
  quantity: number;
  days: number;
  movements: IMovementModel[];
  prices: IPriceHistory[];
}
