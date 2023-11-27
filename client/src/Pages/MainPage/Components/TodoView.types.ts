import { Todo, TodoFolder } from '@Types/Todo';
import { UserAuth } from '@Types/UserAuth';

export type TodoPendingData = {
  type: 'create' | 'toggle' | 'rename';
  pendingTodoId: string;
} | null;

export type TodoPresenterProp = {
  content: string;
  completed: boolean;
  isCreatePending: boolean;
  isTogglePending: boolean;
  isRenamePending: boolean;
  onToggleTodo: () => void;
  onRenameTodo: () => void;
  onDeleteTodo: () => void;
};

export type TodoListProp = {
  todos: Todo[];
  pendingData: TodoPendingData;
  onToggleTodo: (todo: Todo) => void;
  onRenameTodo: (todo: Todo) => void;
  onDeleteTodo: (todo: Todo) => void;
};

export type TodosContainerProp = {
  userAuth: UserAuth;
  selectedFolder: TodoFolder;
};

export type TodoViewProp = {
  userAuth: UserAuth;
  selectedFolder: TodoFolder | null;
};
