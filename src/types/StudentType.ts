export type StudentType = {
  id: string;
  currentUser: string;
  createdAt: Date;
  updatedAt: Date;
  deletedFlag: boolean;
  desc: "";
  serialNumber: number;
  studentNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  sumTotal: number;
  products: {
    productName: string;
    size: string;
    quantity: string;
    inseam: string;
  }[];
  title: string;
  projectId: string;
  release: boolean;
  schedule: string;
  signature: string;
};
