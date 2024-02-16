export type ProjectType = {
  id: string;
  title: string;
  desc: string;
  schedule: string;
  gender: string;
  isAddress:boolean;
  release: boolean;
  products: { sizePath: string; imagePath: string }[];
  createdAt: Date;
  createUser: string;
};
