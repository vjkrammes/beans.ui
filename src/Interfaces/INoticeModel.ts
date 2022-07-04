import {IUserModel} from './IUserModel';

export interface INoticeModel {
  id: string;
  userId: string;
  senderId: string;
  noticeDate: Date;
  title: string;
  text: string;
  read: boolean;
  senderIsSystem: boolean;
  senderIsExchange: boolean;
  sender: IUserModel | null;
}
