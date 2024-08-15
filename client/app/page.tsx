"use client"

import TodoList from "./components/TodoList";

export default function Home() {
  return (
    <div className=" flex min-h-screen bg-gray-100">
      <TodoList />
    </div>
  );
}
