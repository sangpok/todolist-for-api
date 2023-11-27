import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import * as API from '@API/index';
import { UserAuthStore } from '@Store/UserAuthStore';
import { v4 as uuid } from 'uuid';

import { UserAuth } from '@Types/UserAuth';
import { Todo, TodoFolder } from '@Types/Todo';

export const useUserList = () => {
  return useQuery({
    queryKey: ['userList'],
    queryFn: API.getUserList,
  });
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['user', 'create'],
    mutationFn: API.createAccount,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['userList'] });
    },
  });
};

export const useRenameNickname = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['nickname', 'rename'],
    mutationFn: API.renameNickname,
    onMutate({ userAuth, nickname }) {
      const prevUserList = queryClient.getQueryData<UserAuth[]>(['userList']);

      UserAuthStore.changeNickname(nickname);

      if (!prevUserList) return;

      queryClient.cancelQueries();
      queryClient.setQueryData<UserAuth[]>(
        ['userList'],
        [...prevUserList.filter(({ id }) => id !== userAuth.id), { ...userAuth, nickname }]
      );

      return { prevUserList };
    },
    onError(error, variables, context) {
      UserAuthStore.changeNickname(variables.userAuth.nickname);
      queryClient.setQueryData(['userList'], context?.prevUserList);
    },
  });
};

export const useTodoFolder = (userAuth: UserAuth) => {
  return useQuery({
    queryKey: ['folderList', userAuth.id],
    queryFn: () => API.getTodoFolderList(userAuth),
  });
};

export const useCreateTodoFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['todoFolder', 'create'],
    mutationFn: API.createTodoFolder,
    async onMutate({ userAuth, folderName }) {
      await queryClient.cancelQueries({ queryKey: ['folderList', userAuth.id] });

      const prevFolderList = queryClient.getQueryData<TodoFolder[]>(['folderList', userAuth.id]);

      // 임시 ID
      const newFolder = {
        id: uuid(),
        userId: userAuth.id,
        name: folderName,
        createdAt: Number(new Date()),
      };

      queryClient.setQueryData<TodoFolder[]>(
        ['folderList'],
        [...(prevFolderList || []), newFolder]
      );

      return { optimisticData: newFolder };
    },
    onSuccess(data, { userAuth }, context) {
      // 임시 ID 교체
      queryClient.setQueryData<TodoFolder[]>(['folderList', userAuth.id], (prev) =>
        prev ? [...prev.filter(({ id }) => id !== context!.optimisticData.id), data] : []
      );
    },
  });
};

export const useRenameTodoFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['todoFolder', 'rename'],
    mutationFn: API.renameTodoFolder,
    async onMutate({ userAuth, todoFolder, newFolderName }) {
      await queryClient.cancelQueries({ queryKey: ['folderList', userAuth.id] });

      const prevFolderList =
        queryClient.getQueryData<TodoFolder[]>(['folderList', userAuth.id]) || [];
      const newFolder = { ...todoFolder, name: newFolderName };
      const newFolderList = [...prevFolderList.filter(({ id }) => id !== todoFolder.id), newFolder];

      queryClient.setQueryData<TodoFolder[]>(['folderList', userAuth.id], newFolderList);

      return { prevFolderList };
    },
    onError(error, { userAuth }, context) {
      queryClient.setQueryData<TodoFolder[]>(['folderList', userAuth.id], context?.prevFolderList);
    },
  });
};

export const useDeleteTodoFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['todoFolder', 'delete'],
    mutationFn: API.deleteTodoFolder,
    async onMutate({ userAuth, todoFolder }) {
      await queryClient.cancelQueries({ queryKey: ['folderList', userAuth.id] });

      const prevFolderList =
        queryClient.getQueryData<TodoFolder[]>(['folderList', userAuth.id]) || [];
      const newFolderList = [...prevFolderList.filter(({ id }) => id !== todoFolder.id)];

      queryClient.setQueryData<TodoFolder[]>(['folderList', userAuth.id], newFolderList);

      return { prevFolderList };
    },
    onError(error, { userAuth }, context) {
      queryClient.setQueryData<TodoFolder[]>(['folderList', userAuth.id], context?.prevFolderList);
    },
  });
};

export const useTodos = (userAuth: UserAuth, todoFolder: TodoFolder) => {
  return useQuery({
    queryKey: ['todos', userAuth.id, todoFolder.id],
    queryFn: () => API.getTodoList({ userAuth, todoFolder }),
  });
};

export const useAddTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['todo', 'create'],
    mutationFn: API.createTodo,
    async onMutate({ userAuth, todoFolder, todoContent }) {
      await queryClient.cancelQueries({ queryKey: ['todos', userAuth.id, todoFolder.id] });

      const prevTodos =
        queryClient.getQueryData<Todo[]>(['todos', userAuth.id, todoFolder.id]) || [];

      const newTodo: Todo = {
        id: uuid(),
        userId: userAuth.id,
        folderId: todoFolder.id,
        content: todoContent,
        completed: false,
        createdAt: Number(new Date()),
      };

      const newTodos = [...prevTodos, newTodo];

      queryClient.setQueryData<Todo[]>(['todos', userAuth.id, todoFolder.id], newTodos);

      return { newTodo, prevTodos };
    },
    onSuccess(data, { userAuth, todoFolder }, context) {
      queryClient.setQueryData<Todo[]>(['todos', userAuth.id, todoFolder.id], (prev) => [
        ...(prev?.filter(({ id }) => id !== context?.newTodo.id) || []),
        data,
      ]);
    },
    onError(error, { userAuth, todoFolder }, context) {
      queryClient.setQueryData<Todo[]>(['todos', userAuth.id, todoFolder.id], context?.prevTodos);
    },
  });
};

export const useToggleTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['todos', 'toggle'],
    mutationFn: API.toggleTodo,
    async onMutate({ completed, todo, todoFolder, userAuth }) {
      await queryClient.cancelQueries({ queryKey: ['todos', userAuth.id, todoFolder.id] });

      const prevTodos =
        queryClient.getQueryData<Todo[]>(['todos', userAuth.id, todoFolder.id]) || [];
      const newTodo: Todo = { ...todo, completed };
      const newTodos = [...prevTodos.filter(({ id }) => id !== todo.id), newTodo];

      queryClient.setQueryData<Todo[]>(['todos', userAuth.id, todoFolder.id], newTodos);

      return { prevTodos };
    },
    onError(error, { userAuth, todoFolder }, context) {
      queryClient.setQueryData<Todo[]>(['todos', userAuth.id, todoFolder.id], context?.prevTodos);
    },
  });
};

export const useRenameTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['todos', 'rename'],
    mutationFn: API.renameTodo,
    async onMutate({ content, todo, todoFolder, userAuth }) {
      await queryClient.cancelQueries({ queryKey: ['todos', userAuth.id, todoFolder.id] });

      const prevTodos =
        queryClient.getQueryData<Todo[]>(['todos', userAuth.id, todoFolder.id]) || [];
      const newTodo: Todo = { ...todo, content };
      const newTodos = [...prevTodos.filter(({ id }) => id !== todo.id), newTodo];

      queryClient.setQueryData<Todo[]>(['todos', userAuth.id, todoFolder.id], newTodos);

      return { prevTodos };
    },
    onError(error, { userAuth, todoFolder }, context) {
      queryClient.setQueryData<Todo[]>(['todos', userAuth.id, todoFolder.id], context?.prevTodos);
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['todos', 'delete'],
    mutationFn: API.deleteTodo,
    async onMutate({ userAuth, todoFolder, todo }) {
      await queryClient.cancelQueries({ queryKey: ['todos', userAuth.id, todoFolder.id] });

      const prevTodos =
        queryClient.getQueryData<Todo[]>(['todos', userAuth.id, todoFolder.id]) || [];
      const newTodos = [...prevTodos.filter(({ id }) => id !== todo.id)];

      queryClient.setQueryData<Todo[]>(['todos', userAuth.id, todoFolder.id], newTodos);

      return { prevTodos };
    },
    onError(error, { userAuth, todoFolder }, context) {
      queryClient.setQueryData<Todo[]>(['todos', userAuth.id, todoFolder.id], context?.prevTodos);
    },
  });
};
