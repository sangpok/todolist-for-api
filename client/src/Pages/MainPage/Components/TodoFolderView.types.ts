import { TodoFolder } from '@Types/Todo';
import { UserAuth } from '@Types/UserAuth';

export type FolderPendingData = { type: 'rename' | 'create'; pendingId: string } | null;

export type FolderPresenterProp = {
  name: string;
  isRenamePanding: boolean;
  isCreatePending: boolean;
  onSelecetFolder: () => void;
  onRenameFolder: () => void;
  onDeleteFolder: () => void;
};

export type FolderListProp = {
  folderList: TodoFolder[];
  pendingData: FolderPendingData;
  onSelectFolder: (todoFolder: TodoFolder) => void;
  onRenameFolder: (todoFolder: TodoFolder) => void;
  onDeleteFolder: (todoFolder: TodoFolder) => void;
};

export type TodoFolderViewProp = {
  userAuth: UserAuth;
  onSelectFolder: (todoFolder: TodoFolder) => void;
  onDeleteFolder: (todoFolder: TodoFolder) => void;
};
