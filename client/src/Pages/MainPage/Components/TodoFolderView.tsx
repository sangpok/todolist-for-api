import { useTodoFolder } from '@Hooks/index';
import useTodoFolderView from '@Hooks/useTodoFolderView';

import { FolderListProp, FolderPresenterProp, TodoFolderViewProp } from './TodoFolderView.types';
import { TodoFolder } from '@Types/Todo';

const FolderPresenter = ({
  name,
  isRenamePanding,
  isCreatePending,
  onSelecetFolder,
  onRenameFolder,
  onDeleteFolder,
}: FolderPresenterProp) => {
  const textColor = isCreatePending || isRenamePanding ? 'gray' : 'black';
  const renameButtonText = isRenamePanding ? '수정중...' : '수정';

  return (
    <li style={{ display: 'flex' }}>
      <span style={{ flex: 1, color: textColor }} onClick={onSelecetFolder}>
        {name}
      </span>
      <button onClick={onRenameFolder} disabled={isCreatePending || isRenamePanding}>
        {renameButtonText}
      </button>
      <button onClick={onDeleteFolder} disabled={isCreatePending}>
        삭제
      </button>
    </li>
  );
};

const FolderList = ({
  folderList,
  pendingData,
  onSelectFolder,
  onRenameFolder,
  onDeleteFolder,
}: FolderListProp) => {
  return (
    <ul>
      {folderList
        .sort((a, b) => +a.createdAt - +b.createdAt)
        .map((folder) => (
          <FolderPresenter
            key={folder.id}
            {...folder}
            isRenamePanding={
              !!pendingData && pendingData.type === 'rename' && folder.id === pendingData.pendingId
            }
            isCreatePending={
              !!pendingData && pendingData.type === 'create' && folder.id === pendingData.pendingId
            }
            onSelecetFolder={() => onSelectFolder(folder)}
            onRenameFolder={() => onRenameFolder(folder)}
            onDeleteFolder={() => onDeleteFolder(folder)}
          />
        ))}
    </ul>
  );
};

const TodoFolderView = ({ userAuth, onSelectFolder, onDeleteFolder }: TodoFolderViewProp) => {
  const { data: folderList, isLoading } = useTodoFolder(userAuth);
  const {
    initialLoading,
    hasNoFolderList,
    hasFolderList,
    pendingData,
    createFolder,
    renameFolder,
    deleteFolder,
  } = useTodoFolderView({ isLoading, folderList });

  const handleAddFolder = () => {
    const folderName = prompt('폴더 이름을 입력해주세용');

    if (!folderName) {
      return;
    }

    createFolder({ userAuth, folderName });
  };

  const handleRenameFolder = (todoFolder: TodoFolder) => {
    const newFolderName = prompt('바꿀 이름을 입력해주세요');

    if (!newFolderName) {
      return;
    }

    renameFolder({ userAuth, todoFolder, newFolderName });
  };

  const handleDeleteFolder = (todoFolder: TodoFolder) => {
    deleteFolder({ userAuth, todoFolder });
    onDeleteFolder(todoFolder);
  };

  return (
    <div>
      <h2>투두 폴더</h2>

      {initialLoading && <p>투두 폴더를 불러오는 중입니다...</p>}
      {hasNoFolderList && <p>새로운 투두 폴더를 만들어보세요!</p>}
      {hasFolderList && (
        <FolderList
          folderList={folderList!}
          pendingData={pendingData}
          onSelectFolder={onSelectFolder}
          onRenameFolder={handleRenameFolder}
          onDeleteFolder={handleDeleteFolder}
        />
      )}

      <div>
        <button onClick={handleAddFolder}>투두 폴더 추가</button>
      </div>
    </div>
  );
};

export default TodoFolderView;
