export type UserAuth = {
  id: string;
  nickname: string;
};

let userAuth: UserAuth | null = null;

let listeners: (() => void)[] = [];

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

export const UserAuthStore = {
  subscribe(listener: () => void) {
    listeners = [...listeners, listener];

    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },

  getSnapshot() {
    return userAuth;
  },

  initializeAuth(newUserAuth: UserAuth) {
    userAuth = { ...newUserAuth };
    emitChange();
  },

  changeNickname(newNickname: string) {
    if (!userAuth) throw new Error(`changeNickname에서 오류: userAuth 없음`);

    userAuth = { ...userAuth, nickname: newNickname };
    emitChange();
  },
};
