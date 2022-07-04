export interface ISellHoldingModel {
  id: string;
  beanName: string;
  beanFilename: string;
  holdingDate: Date;
  holdingQuantity: number;
  holdingPrice: number;
  sellQuantity: number;
  selected: boolean;
}
