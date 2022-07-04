import {CostBasisType} from "../Enums/CostBasisType";

export interface ICostBasis {
  beanId: string;
  beanName: string;
  filename: string;
  basisType: CostBasisType;
  basis: number;
  gainOrLoss: number;
  percent: number;
}
