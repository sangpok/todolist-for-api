import { useChangeNickname, useCreateTodoFolder, useTodoFolder } from '@Hooks/index';
import { UserAuthStore } from '@Store/UserAuthStore';
import { useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';
import UserInfoView from './Components/UserInfoView';

const MainPage = () => {
  const navigate = useNavigate();

  const userAuth = useSyncExternalStore(UserAuthStore.subscribe, UserAuthStore.getSnapshot)!;

  if (!userAuth) {
    navigate('/');
  }

  const { data: folderList, isLoading } = useTodoFolder(userAuth);

  const createFolderMutation = useCreateTodoFolder();

  const handleAddFolder = () => {
    const folderName = prompt('폴더 이름을 입력해주세용');

    if (!folderName) {
      return;
    }

    createFolderMutation.mutate({ userAuth, folderName });
  };

  return (
    <div>
      <UserInfoView userAuth={userAuth} />

      <br />

      <div>
        <h2>투두 폴더</h2>
        {isLoading && <p>투두 폴더를 불러오는 중입니다...</p>}
        {folderList && (
          <ul>
            {folderList
              .sort((a, b) => +a.createdAt - +b.createdAt)
              .map((folder) => (
                <li key={folder.id}>{folder.name}</li>
              ))}
          </ul>
        )}
        <div>
          <button onClick={handleAddFolder}>투두 폴더 추가</button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
