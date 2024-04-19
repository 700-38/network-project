'use client';

import React, { useState } from 'react';

interface Props {
  onSendMessage: (message: string) => void;
}

const InputBox: React.FC<Props> = ({ onSendMessage }) => {
  const [input, setInput] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex">
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        className="flex-grow rounded-l-lg border p-2"
      />
      <button
        onClick={handleSend}
        className="rounded-r-lg bg-blue-500 p-2 text-white hover:bg-blue-700">
        Send
      </button>
    </div>
  );
};

export default InputBox;
