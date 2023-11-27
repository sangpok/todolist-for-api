import { useTodos } from '@Hooks/index';
import useTodoView from '@Hooks/useTodoView';
import {
  TodoListProp,
  TodoPresenterProp,
  TodoViewProp,
  TodosContainerProp,
} from './TodoView.types';
import { Todo } from '@Types/Todo';

const TodoPresenter = ({
  content,
  completed,
  isCreatePending,
  isTogglePending,
  isRenamePending,
  onToggleTodo,
  onRenameTodo,
  onDeleteTodo,
}: TodoPresenterProp) => {
  const textColor = isCreatePending ? 'gray' : 'black';
  const renameButtonText = isRenamePending ? '수정중...' : '수정';

  return (
    <li style={{ display: 'flex' }}>
      <span style={{ flex: 1, color: textColor }} onClick={onToggleTodo}>
        {completed ? <del>{content}</del> : content}
      </span>
      <button onClick={onRenameTodo} disabled={isCreatePending || isRenamePending}>
        {renameButtonText}
      </button>
      <button onClick={onDeleteTodo} disabled={isCreatePending}>
        삭제
      </button>
    </li>
  );
};

const TodoList = ({
  todos,
  pendingData,
  onToggleTodo,
  onRenameTodo,
  onDeleteTodo,
}: TodoListProp) => {
  return (
    <ul>
      {todos
        .sort((a, b) => a.createdAt - b.createdAt)
        .map((todo) => (
          <TodoPresenter
            key={todo.id}
            {...todo}
            isCreatePending={
              !!pendingData &&
              pendingData.type === 'create' &&
              todo.id === pendingData.pendingTodoId
            }
            isTogglePending={
              !!pendingData &&
              pendingData.type === 'toggle' &&
              todo.id === pendingData.pendingTodoId
            }
            isRenamePending={
              !!pendingData &&
              pendingData.type === 'rename' &&
              todo.id === pendingData.pendingTodoId
            }
            onToggleTodo={() => onToggleTodo(todo)}
            onRenameTodo={() => onRenameTodo(todo)}
            onDeleteTodo={() => onDeleteTodo(todo)}
          />
        ))}
    </ul>
  );
};

const TodosContainer = ({ userAuth, selectedFolder }: TodosContainerProp) => {
  const { data: todos, isLoading } = useTodos(userAuth, selectedFolder);

  const {
    initialLoading,
    hasNoTodos,
    hasTodos,
    pendingData,
    addTodo,
    toggleTodo,
    renameTodo,
    deleteTodo,
  } = useTodoView({ todos, isLoading });

  const handleAddTodo = () => {
    const todoContent = prompt('어떤 할일이 있으세요?');

    if (!todoContent) {
      return;
    }

    addTodo({ userAuth, todoFolder: selectedFolder, todoContent });
  };

  const handleToggleTodo = (todo: Todo) => {
    toggleTodo({ userAuth, todoFolder: selectedFolder, todo, completed: !todo.completed });
  };

  const handleRenameTodo = (todo: Todo) => {
    const content = prompt('어떤 할일로 수정하겠어요?');

    if (!content) {
      return;
    }

    renameTodo({ userAuth, todoFolder: selectedFolder, todo, content });
  };

  const handleDeleteTodo = (todo: Todo) => {
    deleteTodo({ userAuth, todoFolder: selectedFolder, todo });
  };

  return (
    <div>
      <h2>투두 목록: {selectedFolder.name}</h2>

      {initialLoading && <p>투두를 불러오는 중입니다...</p>}
      {hasNoTodos && <p>새로운 투두를 추가해보세요</p>}
      {hasTodos && (
        <TodoList
          todos={todos!}
          pendingData={pendingData}
          onToggleTodo={handleToggleTodo}
          onRenameTodo={handleRenameTodo}
          onDeleteTodo={handleDeleteTodo}
        />
      )}

      <div>
        <button onClick={handleAddTodo}>투두 추가</button>
      </div>
    </div>
  );
};

const TodoView = ({ userAuth, selectedFolder }: TodoViewProp) => {
  if (!selectedFolder) {
    return (
      <div>
        <h2>투두 목록</h2>
        <p>투두 폴더를 선택해주세요!</p>
      </div>
    );
  }

  return <TodosContainer userAuth={userAuth} selectedFolder={selectedFolder} />;
};

export default TodoView;
