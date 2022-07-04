export interface IBuyBeanModel {
  userid: string;
  token: string;
  items: IBuyBeanItem[];
}

export interface IBuyBeanItem {
  id: string;
  name: string;
  quantity: number;
}
