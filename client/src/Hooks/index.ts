import { useMutation, useQuery, useQueryClient } from 'react-query';

import * as API from '@API/index';
import { UserAuth, UserAuthStore } from '@/Store/UserAuthStore';

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
    onSuccess: (userAuth, variables, context) => {
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
    onSuccess(userAuth, variables, context) {
      queryClient.invalidateQueries(['userList']);
    },
  });
};

export const useTodoFolder = (userAuth: UserAuth) => {
  return useQuery({
    queryKey: ['folderList', userAuth.id],
    queryFn: () => API.getTodoFolderList(userAuth),
  });
};
