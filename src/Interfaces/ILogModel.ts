export interface ILogModel {
  id: string;
  timestamp: Date;
  level: number;
  ip: string;
  identifier: string;
  source: string;
  description: string;
  data: string;
}
