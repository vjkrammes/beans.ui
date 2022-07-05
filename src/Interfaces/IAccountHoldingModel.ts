export interface IAccountHoldingModel {
  id: string;
  beanName: string;
  fileName: string;
  purchaseDate: Date;
  purchasePrice: number;
  quantity: number;
  currentPrice: number;
  gainOrLoss: number;
  percent: number;
}
