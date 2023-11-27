import { useMutation, useQuery, useQueryClient } from 'react-query';

import * as API from '@API/index';
import { UserAuth, UserAuthStore } from '@/Store/UserAuthStore';

import { v4 as uuid } from 'uuid';

export const useUserList = () => {
  // const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['userList'],
    queryFn: API.getUserList,
  });
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: API.createAccount,
    onSuccess() {
      queryClient.invalidateQueries(['userList']);
    },
  });
};

export const useChangeNickname = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: API.changeNickname,
    onMutate({ userAuth, nickname }) {
      const prevUserList = queryClient.getQueryData<UserAuth[]>(['userList']);

      UserAuthStore.changeNickname(nickname);

      if (!prevUserList) return;

      queryClient.cancelMutations();
      queryClient.setQueryData(
        ['userList'],
        [...prevUserList.filter(({ id }) => id !== userAuth.id), { ...userAuth, nickname }]
      );
    },
    onSuccess() {
      queryClient.invalidateQueries(['userList']);
    },
  });
};

export const useTodoFolder = (userAuth: UserAuth) => {
  return useQuery({
    queryKey: ['folderList'],
    queryFn: () => API.getTodoFolderList(userAuth),
  });
};

export const useCreateTodoFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: API.createTodoFolder,
    async onMutate({ userAuth, folderName }) {
      await queryClient.cancelQueries({ queryKey: ['folderList'] });

      const prevFolderList = queryClient.getQueryData<API.TodoFolder[]>(['folderList']);

      // 임시 ID
      const newFolder = {
        id: uuid(),
        userId: userAuth.id,
        name: folderName,
        createdAt: new Date(),
      };

      queryClient.setQueryData(['folderList'], [...(prevFolderList || []), newFolder]);

      return { optimisticData: newFolder };
    },
    onSuccess(data, variables, context) {
      // 임시 ID 교체
      queryClient.setQueryData<API.TodoFolder[]>(['folderList'], (prev) =>
        prev ? [...prev.filter(({ id }) => id !== context!.optimisticData.id), data] : []
      );
    },
  });
};
