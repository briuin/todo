import React, { useState } from 'react';

interface TodoItemProps {
  title: string;
  completed: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onUpdate: (newTitle: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ title, completed, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleUpdate = () => {
    if (newTitle.trim() !== '') {
      onUpdate(newTitle);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded shadow-md">
      {isEditing ? (
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={handleUpdate}
          onKeyPress={(e) => e.key === 'Enter' && handleUpdate()}
          className="flex-grow p-2 border border-gray-300 rounded"
        />
      ) : (
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={completed}
            onChange={onToggle}
            className="form-checkbox h-5 w-5 text-green-500"
          />
          <span
            className={`text-lg ${completed ? 'line-through text-gray-500' : ''}`}
            onDoubleClick={() => setIsEditing(true)}
          >
            {title}
          </span>
        </div>
      )}
      <button
        onClick={onDelete}
        className="text-red-500 hover:text-red-700"
      >
        Delete
      </button>
    </div>
  );
};

export default TodoItem;
