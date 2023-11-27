import { v4 as uuid } from 'uuid';

import * as Util from '@Utils/index';

import { UserAuth } from '@Types/UserAuth';
import { Todo, TodoFolder } from '@Types/Todo';

import { API_URL, END_POINTS } from '@Constants/index';

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
  DELETE: <T>(endpoint: string) =>
    fetch(`${API_URL}${endpoint}`, { method: 'DELETE' }).then((res) => res.json() as Promise<T>),
};

export const getUserList = () => Fetcher.GET<UserAuth[]>(`${END_POINTS.USERS}`);

/**
 * 원래 보내는 데이터는 없겠지만, JSON Server에서 번호가 아닌 uuid로 id를 생성하려면
 * 따로 lowdb를 사용해서 응답 데이터를 커스텀해줘야 한다
 * 그런데 귀찮으니까 여기에서 데이터를 만들어 주기~
 */
export const createAccount = () =>
  Fetcher.POST<UserAuth>(`${END_POINTS.USERS}`, { id: uuid(), nickname: Util.createRandomName() });

export const renameNickname = ({ userAuth, nickname }: { userAuth: UserAuth; nickname: string }) =>
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
    createdAt: Number(new Date()),
  });

export const renameTodoFolder = ({
  userAuth,
  todoFolder,
  newFolderName,
}: {
  userAuth: UserAuth;
  todoFolder: TodoFolder;
  newFolderName: string;
}) =>
  Fetcher.PATCH<TodoFolder>(`${END_POINTS.USERS}/${userAuth.id}/folders/${todoFolder.id}`, {
    name: newFolderName,
  });

export const deleteTodoFolder = ({
  userAuth,
  todoFolder,
}: {
  userAuth: UserAuth;
  todoFolder: TodoFolder;
}) => Fetcher.DELETE<TodoFolder>(`${END_POINTS.USERS}/${userAuth.id}/folders/${todoFolder.id}`);

export const getTodoList = ({
  userAuth,
  todoFolder,
}: {
  userAuth: UserAuth;
  todoFolder: TodoFolder;
}) => Fetcher.GET<Todo[]>(`${END_POINTS.USERS}/${userAuth.id}/folders/${todoFolder.id}/todos`);

export const createTodo = ({
  userAuth,
  todoFolder,
  todoContent,
}: {
  userAuth: UserAuth;
  todoFolder: TodoFolder;
  todoContent: string;
}) =>
  Fetcher.POST<Todo>(`${END_POINTS.USERS}/${userAuth.id}/folders/${todoFolder.id}/todos`, {
    id: uuid(),
    userId: userAuth.id,
    folderId: todoFolder.id,
    content: todoContent,
    completed: false,
    createdAt: Number(new Date()),
  });

export const toggleTodo = ({
  userAuth,
  todoFolder,
  todo,
  completed,
}: {
  userAuth: UserAuth;
  todoFolder: TodoFolder;
  todo: Todo;
  completed: boolean;
}) =>
  Fetcher.PATCH<Todo>(
    `${END_POINTS.USERS}/${userAuth.id}/folders/${todoFolder.id}/todos/${todo.id}`,
    { completed }
  );

export const renameTodo = ({
  userAuth,
  todoFolder,
  todo,
  content,
}: {
  userAuth: UserAuth;
  todoFolder: TodoFolder;
  todo: Todo;
  content: string;
}) =>
  Fetcher.PATCH<Todo>(
    `${END_POINTS.USERS}/${userAuth.id}/folders/${todoFolder.id}/todos/${todo.id}`,
    { content }
  );

export const deleteTodo = ({
  userAuth,
  todoFolder,
  todo,
}: {
  userAuth: UserAuth;
  todoFolder: TodoFolder;
  todo: Todo;
}) =>
  Fetcher.DELETE<TodoFolder>(
    `${END_POINTS.USERS}/${userAuth.id}/folders/${todoFolder.id}/todos/${todo.id}`
  );
