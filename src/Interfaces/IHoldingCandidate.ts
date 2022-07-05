export interface IHoldingCandidate {
  holdingId: string;
  selected: boolean;
  purchaseDate: Date;
  quantity: number;
  purchasePrice: number;
  sellQuantity: number;
}
