export type Todo = {
  id: string;
  userId: string;
  folderId: string;
  content: string;
  completed: boolean;
  createdAt: number;
};

export type TodoFolder = {
  id: string;
  userId: string;
  name: string;
  createdAt: number;
};
