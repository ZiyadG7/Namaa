export interface Company {
  id: string;
  name: string;
  marketCap: string;
  balance: string;
  price: string;
  change30D: string;
  change1Y: string;
  changeToday: string;
  category: "followed" | "notFollowed";
}