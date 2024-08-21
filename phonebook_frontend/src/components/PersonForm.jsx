import React from "react";

const PersonForm = ({
  addPerson,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
  numberFormat
}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <input value={newName} onChange={handleNameChange} required />
      </div>
      <div>
        number:&nbsp;&nbsp;
        <input value={newNumber} onChange={handleNumberChange} required />
        <br />
        format must bu 0DD-DDDDDDD or 0D-DDDDDDD
        <br />
        your format is {numberFormat ? "OK" : "IS NOT OK"}
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
