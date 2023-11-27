import { useEffect, useState, useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';

import TodoFolderView from './Components/TodoFolderView';
import TodoView from './Components/TodoView';
import UserInfoView from './Components/UserInfoView';

import { UserAuthStore } from '@Store/UserAuthStore';

import type { TodoFolder } from '@Types/Todo';

const MainPage = () => {
  const navigate = useNavigate();

  const userAuth = useSyncExternalStore(UserAuthStore.subscribe, UserAuthStore.getSnapshot)!;

  const [selectedFolder, setSelectedFolder] = useState<TodoFolder | null>(null);

  useEffect(() => {
    if (!userAuth) {
      navigate('/');
    }
  }, [userAuth]);

  if (!userAuth) return;

  const handleSelectFolder = (todoFolder: TodoFolder) => {
    setSelectedFolder(todoFolder);
  };

  const handleDeleteFolder = (todoFolder: TodoFolder) => {
    if (todoFolder.id === selectedFolder?.id) {
      setSelectedFolder(null);
    }
  };

  return (
    <div>
      <UserInfoView userAuth={userAuth} />
      <br />
      <TodoFolderView
        userAuth={userAuth}
        onSelectFolder={handleSelectFolder}
        onDeleteFolder={handleDeleteFolder}
      />
      <br />
      <TodoView userAuth={userAuth} selectedFolder={selectedFolder} />
    </div>
  );
};

export default MainPage;
