import {IBeanModel} from './IBeanModel';

export interface IMovementModel {
  id: string;
  beanId: string;
  movementDate: Date;
  open: number;
  close: number;
  movement: number;
  movementType: number;
  bean?: IBeanModel;
}
