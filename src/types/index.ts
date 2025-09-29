export interface Post {
  id: string;
  noodleHard: string;
  oilAmount: string;
  tasteLevel: string;
  photoBefore: string;
  photoAfter: string;
  comment: string | null;
  sustainable: string;
  createdAt: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
