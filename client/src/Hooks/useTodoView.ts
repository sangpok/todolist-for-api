import { useIsMutating } from '@tanstack/react-query';
import { useAddTodo, useDeleteTodo, useRenameTodo, useToggleTodo } from '.';
import { Todo } from '@Types/Todo';

type TodoPendingData = { type: 'create' | 'toggle' | 'rename'; pendingTodoId: string } | null;

type TodoViewHookProp = { todos: Todo[] | undefined; isLoading: boolean };

const useTodoView = ({ todos, isLoading }: TodoViewHookProp) => {
  const initialLoading = isLoading;
  const hasNoTodos = !initialLoading && todos && todos.length === 0;
  const hasTodos = !initialLoading && todos && todos.length !== 0;

  const addTodoMutation = useAddTodo();
  const toggleTodoMutation = useToggleTodo();
  const renameTodoMutation = useRenameTodo();
  const deleteTodoMutation = useDeleteTodo();

  const isMutating = useIsMutating({ mutationKey: ['todos'] });

  let pendingData: TodoPendingData = null;

  if (isMutating && addTodoMutation.isPending) {
    pendingData = { type: 'create', pendingTodoId: addTodoMutation.context!.newTodo.id };
  } else if (isMutating && toggleTodoMutation.isPending) {
    pendingData = {
      type: 'toggle',
      pendingTodoId: toggleTodoMutation.variables.todo.id,
    };
  } else if (isMutating && renameTodoMutation.isPending) {
    pendingData = {
      type: 'rename',
      pendingTodoId: renameTodoMutation.variables.todo.id,
    };
  }

  return {
    initialLoading,
    hasNoTodos,
    hasTodos,
    pendingData,

    addTodo: addTodoMutation.mutate,
    toggleTodo: toggleTodoMutation.mutate,
    renameTodo: renameTodoMutation.mutate,
    deleteTodo: deleteTodoMutation.mutate,
  };
};

export default useTodoView;
