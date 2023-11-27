import { useNavigate } from 'react-router-dom';

import { useCreateAccount, useUserList } from '@Hooks/index';
import { UserAuthStore } from '@Store/UserAuthStore';
import { UserAuth } from '@Types/UserAuth';

const LandingPage = () => {
  const navigate = useNavigate();

  const { data: userList, isLoading } = useUserList();
  const createUserMutation = useCreateAccount();

  const initialLoading = isLoading;
  const hasNoUserList = !initialLoading && userList && userList.length === 0;
  const hasUserList = !initialLoading && userList && userList.length !== 0;

  const handleUserClick = (newUserAuth: UserAuth) => {
    UserAuthStore.initializeAuth(newUserAuth);
    navigate('/home');
  };

  const handleCreateAccountClick = () => {
    createUserMutation.mutate();
  };

  return (
    <div>
      <h2>유저 목록</h2>
      <div>
        {initialLoading && <p>불러오는 중...</p>}
        {hasNoUserList && <p>유저 목록이 없어용</p>}
        {hasUserList && (
          <ul>
            {userList.map((user) => (
              <li key={user.id} onClick={() => handleUserClick(user)}>
                {user.nickname}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <button onClick={handleCreateAccountClick} disabled={createUserMutation.isPending}>
          {createUserMutation.isPending ? '만드는 중...' : '새로 만들고 시작하기'}
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
