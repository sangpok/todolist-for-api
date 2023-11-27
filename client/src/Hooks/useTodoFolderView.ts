import { useIsMutating } from '@tanstack/react-query';
import { useCreateTodoFolder, useDeleteTodoFolder, useRenameTodoFolder } from '.';
import { TodoFolder } from '@Types/Todo';

type FolderPendingData = { type: 'rename' | 'create'; pendingId: string } | null;

type TodoFolderViewHookProp = {
  isLoading: boolean;
  folderList: TodoFolder[] | undefined;
};

const useTodoFolderView = ({ isLoading, folderList }: TodoFolderViewHookProp) => {
  const initialLoading = isLoading;
  const hasNoFolderList = !initialLoading && folderList && folderList.length === 0;
  const hasFolderList = !initialLoading && folderList && folderList.length !== 0;

  const renameFolderMutation = useRenameTodoFolder();
  const deleteFolderMutation = useDeleteTodoFolder();
  const createFolderMutation = useCreateTodoFolder();

  const isMutating = useIsMutating({ mutationKey: ['todoFolder'] });

  let pendingData: FolderPendingData = null;

  if (isMutating && renameFolderMutation.isPending) {
    pendingData = { type: 'rename', pendingId: renameFolderMutation.variables.todoFolder.id };
  } else if (isMutating && createFolderMutation.isPending) {
    pendingData = { type: 'create', pendingId: createFolderMutation.context!.optimisticData.id };
  }

  return {
    initialLoading,
    hasNoFolderList,
    hasFolderList,
    pendingData,

    renameFolder: renameFolderMutation.mutate,
    deleteFolder: deleteFolderMutation.mutate,
    createFolder: createFolderMutation.mutate,
  };
};

export default useTodoFolderView;
