import React from 'react';

import TodoList from './components/TodoList'
import NewTodo from './components/NewTodo';
import './App.css';

const App: React.FC = () => {
  const todos = [{id:'t1', text: 'Finish the course'}];
  const addTodoHandler = (text: string) =>{
    console.log(text)
  }

  return (
    <div className="App">
      <NewTodo onAddTodo={addTodoHandler}/>
      <TodoList items={todos}/>
    </div>
  );
};

export default App;
