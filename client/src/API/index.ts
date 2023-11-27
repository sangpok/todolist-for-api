import { UserAuth } from '@/Store/UserAuthStore';
import { v4 as uuid } from 'uuid';

import * as Util from '@Utils/index';

export type Todo = {
  id: string;
  content: string;
  completed: boolean;
  createdAt: Date;
};

export type TodoFolder = {
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

/**
 * 원래 보내는 데이터는 없겠지만, JSON Server에서 번호가 아닌 uuid로 id를 생성하려면
 * 따로 lowdb를 사용해서 응답 데이터를 커스텀해줘야 한다
 * 그런데 귀찮으니까 여기에서 데이터를 만들어 주기~
 */
export const createAccount = () =>
  Fetcher.POST<UserAuth>(`${END_POINTS.USERS}`, { id: uuid(), nickname: Util.createRandomName() });

export const changeNickname = ({ userAuth, nickname }: { userAuth: UserAuth; nickname: string }) =>
  Fetcher.PATCH<UserAuth>(`${END_POINTS.USERS}/${userAuth.id}`, { nickname });

export const getTodoFolderList = (userAuth: UserAuth) =>
  Fetcher.GET<TodoFolder[]>(`${END_POINTS.USERS}/${userAuth.id}/folders`);

export const createTodoFolder = ({
  userAuth,
  folderName,
}: {
  userAuth: UserAuth;
  folderName: string;
}) =>
  Fetcher.POST<TodoFolder>(`${END_POINTS.USERS}/${userAuth.id}/folders`, {
    id: uuid(),
    userId: userAuth.id,
    name: folderName,
    createdAt: new Date(),
  });
