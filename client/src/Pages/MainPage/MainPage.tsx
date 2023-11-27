import { useChangeNickname, useTodoFolder } from '@Hooks/index';
import { UserAuthStore } from '@Store/UserAuthStore';
import { useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();

  const userAuth = useSyncExternalStore(UserAuthStore.subscribe, UserAuthStore.getSnapshot)!;

  if (!userAuth) {
    navigate('/');
  }

  const { data: folderList } = useTodoFolder(userAuth);

  const changeNicknameMutation = useChangeNickname();

  const handleChangeNickname = () => {
    const newNickname = prompt('바꿀 닉네임을 입력해주세요');

    if (!newNickname) {
      return;
    }

    changeNicknameMutation.mutate({ userAuth, nickname: newNickname });
  };

  return (
    <div>
      <div>
        <h2>유저 정보</h2>
        <div>
          <p>유저 ID: {userAuth.id}</p>
          <p>유저 ID: {userAuth.nickname}</p>
          {changeNicknameMutation.isLoading && changeNicknameMutation.variables?.userAuth.id}
        </div>

        <div>
          <button onClick={handleChangeNickname}>닉네임 변경</button>
        </div>
      </div>

      <br />

      <div>
        <h2>투두 폴더</h2>
        {folderList && folderList.map((folder) => <li>{folder.name}</li>)}
      </div>
    </div>
  );
};

export default MainPage;
