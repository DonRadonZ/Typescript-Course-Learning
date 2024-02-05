import React, { useState } from 'react';
// import { Route } from 'react-router-dom';

import TodoList from './components/TodoList'
import NewTodo from './components/NewTodo';
import {Todo} from './todo.model';
import './App.css';


const App: React.FC = () => {
  const [todos,setTodos] = useState<Todo[]>([]);
  
  const addTodoHandler = (text: string) =>{
    setTodos(prevTodos => [
      ...prevTodos,
      {id: Math.random().toString(), text: text}
    ]);
  };

  const todoDeleteHandler = (todoId: string) => {
    setTodos(prevTodos => {
      return prevTodos.filter(todo => todo.id !== todoId);
    });
  }

  return (
    <div className="App">
      <NewTodo onAddTodo={addTodoHandler}/>
      <TodoList items={todos} onDeleteTodo={todoDeleteHandler}/>
  
    </div>
  );
};

export default App;
