import React from "react";

const Persons = ({ personsToShow, onDeletePerson }) => {
  return (
    <ul>
      {personsToShow.map((person) => (
        <li key={person.id}>
          {person.name} {person.number} &nbsp;&nbsp;&nbsp;
          <button onClick={() => onDeletePerson(person.id)}>delete</button>
        </li>
      ))}
    </ul>
  );
};

export default Persons;
