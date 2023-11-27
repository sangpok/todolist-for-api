import { useChangeNickname } from '@Hooks/index';
import { UserAuth } from '@Store/UserAuthStore';

const UserInfoPresenter = ({
  id,
  nickname,
  isLoading,
}: {
  id: string;
  nickname: string;
  isLoading: boolean;
}) => {
  const nicknameColor = isLoading ? 'gray' : 'black';

  return (
    <div>
      <p>유저 ID: {id}</p>
      <p style={{ color: nicknameColor }}>유저 Nickname: {nickname}</p>
    </div>
  );
};

const ButtonPresenter = ({ isLoading, onClick }: { isLoading: boolean; onClick: () => void }) => {
  const buttonText = isLoading ? '닉네임 변경중 ... ' : '닉네임 변경';

  return (
    <div>
      <button onClick={onClick} disabled={isLoading}>
        {buttonText}
      </button>
    </div>
  );
};

const UserInfoView = ({ userAuth }: { userAuth: UserAuth }) => {
  const { mutate, isLoading } = useChangeNickname();

  const handleChangeNickname = () => {
    const newNickname = prompt('바꿀 닉네임을 입력해주세요');

    if (!newNickname) {
      return;
    }

    mutate({ userAuth, nickname: newNickname });
  };

  return (
    <div>
      <h2>유저 정보</h2>
      <UserInfoPresenter {...userAuth} isLoading={isLoading} />
      <ButtonPresenter isLoading={isLoading} onClick={handleChangeNickname} />
    </div>
  );
};

export default UserInfoView;
