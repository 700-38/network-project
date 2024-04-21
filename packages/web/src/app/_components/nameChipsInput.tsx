import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { IoClose } from 'react-icons/io5';

interface NameChipsInputProps {
  names: string[];
  setNames: Dispatch<SetStateAction<string[]>>;
  currentName: string;
  setCurrentName: Dispatch<SetStateAction<string>>;
}

const NameChipsInput: FC<NameChipsInputProps> = ({
  names,
  setNames,
  currentName,
  setCurrentName,
}) => {
  // Function to handle input change
  const handleInputChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    setCurrentName(event.target.value);
  };

  // Function to handle form submission
  const handleFormSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const trimmedName = currentName.trim();
    if (trimmedName && !names.includes(trimmedName)) {
      // Prevent adding empty names
      setNames([...names, currentName.trim()]); // Add the trimmed name to the names array
      console.log('Added name: ' + trimmedName);
    }

    setCurrentName(''); // Clear the input field
  };

  // Function to remove a name from the list
  const removeName = (nameToRemove: string) => {
    console.log('Removed name: ' + nameToRemove);
    setNames(names.filter((name) => name !== nameToRemove));
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit} className="flex w-full flex-1 items-center">
        <div className="flex h-full flex-wrap gap-1 rounded-2xl bg-project_gray p-2">
          {names.map((name, index) => {
            return (
              <div
                className="relative flex h-8 items-center justify-center rounded-full border border-solid bg-project_light_gray pl-2 pr-6 text-project_gray"
                key={index + name}>
                {name}
                <div
                  className="absolute right-2 rounded-full transition-colors hover:bg-project_gray"
                  onClick={() => removeName(name)}>
                  <IoClose className="h-3 w-3 border-solid text-white" />
                </div>
              </div>
            );
          })}

          <input
            type="text"
            value={currentName}
            onChange={handleInputChange}
            className="w-fit bg-transparent text-project_white outline-none"
            placeholder="Enter the names"
          />
        </div>
      </form>
    </div>
  );
};

export default NameChipsInput;
