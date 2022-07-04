import { ISellToOfferItem } from './ISellToOfferItem';

export interface ISellToOfferModel {
  offerId: string;
  sellerId: string;
  items: ISellToOfferItem[];
}
