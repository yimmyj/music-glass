import React, { useState } from "react";

let currentTerm;

export default function SelectTerm() {

  const getInitialState = () => {
    const value = "medium";
    currentTerm = value;
    return value;
  };

  const [value, setValue] = useState(getInitialState);

  const handleChange = (e) => {
        setValue(e.target.value);
        currentTerm = e.target.value;
      };

  return (
    <div>
      <select value={value} onChange={handleChange}>
        <option value="short">Short</option>
        <option value="medium">Medium</option>
        <option value="long">Long</option>
      </select>
    </div>
  );
}

export {currentTerm};