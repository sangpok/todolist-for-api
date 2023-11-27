import { UserAuth } from '@/Store/UserAuthStore';
import { v4 as uuid } from 'uuid';

import * as Util from '@Utils/index';

type Todo = {
  id: string;
  content: string;
  completed: boolean;
  createdAt: Date;
};

type TodoFolder = {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
};

const API_URL = 'http://localhost:3001';

const END_POINTS = {
  USERS: '/users',
} as const;

const Fetcher = {
  GET: <T>(endpoint: string) =>
    fetch(`${API_URL}${endpoint}`).then((res) => res.json() as Promise<T>),
  POST: <T>(endpoint: string, formdata: object) =>
    fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formdata),
    }).then((res) => res.json() as Promise<T>),
  PATCH: <T>(endpoint: string, formdata: object) =>
    fetch(`${API_URL}${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formdata),
    }).then((res) => res.json() as Promise<T>),
  // DELETE:
};

export const getUserList = () => Fetcher.GET<UserAuth[]>(`${END_POINTS.USERS}`);

export const createAccount = () =>
  Fetcher.POST<UserAuth>(`${END_POINTS.USERS}`, { id: uuid(), nickname: Util.createRandomName() });

export const changeNickname = ({ userAuth, nickname }: { userAuth: UserAuth; nickname: string }) =>
  Fetcher.PATCH<UserAuth>(`${END_POINTS.USERS}/${userAuth.id}`, { nickname });

export const getTodoFolderList = (userAuth: UserAuth) =>
  Fetcher.GET<TodoFolder[]>(`${END_POINTS.USERS}/${userAuth.id}/folders`);
