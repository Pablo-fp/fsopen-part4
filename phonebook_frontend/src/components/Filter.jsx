import React from "react";

const Filter = ({ searchName, handleSearchChange }) => {
  return (
    <div>
      filter shown with: &nbsp;
      <input
        type="text"
        value={searchName}
        onChange={handleSearchChange}
        placeholder="Search names"
      />
    </div>
  );
};

export default Filter;
