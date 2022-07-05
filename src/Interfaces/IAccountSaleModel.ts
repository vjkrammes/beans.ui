export interface IAccountSaleModel {
  id: string;
  beanName: string;
  fileName: string;
  purchaseDate: Date;
  saleDate: Date;
  longTerm: boolean;
  quantity: number;
  costBasis: number;
  salePrice: number;
  gainOrLoss: number;
  percent: number;
}
