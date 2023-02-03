export type ProjectType = {
  id: string;
  title: string;
  desc: string;
  schedule: string;
  gender: number;
  release: boolean;
  products: string[];
  createdAt: Date;
  createUser: string;
};
