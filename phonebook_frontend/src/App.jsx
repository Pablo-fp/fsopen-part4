import { useState, useEffect } from "react";
import personService from "./services/persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [numberFormat, setNumberFormat] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [message, setMessage] = useState({ type: null, content: null });

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    if (persons.some((person) => person.name === newName)) {
      const response = window.confirm(
        `${newName} is already added to phonebook, do you want to replace the old number with a new one?`
      );
      if (!response) return;
      const existingPerson = persons.find((person) => person.name === newName);
      const newPerson = { ...existingPerson, number: newNumber };
      personService
        .update(newPerson.id, newPerson)
        .then((updatedPerson) => {
          setPersons(
            persons.map((person) =>
              person.id !== updatedPerson.id ? person : updatedPerson
            )
          );
          setMessage({
            type: "success",
            content: `Updated ${newPerson.name}´s number`
          });
          setNewName("");
          setNewNumber("");
          clearNotification();
        })
        .catch((error) => {
          setMessage({
            type: "error",
            content: error.response.data.error || "an error occured..."
          });
          clearNotification();
        });
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      };

      personService.create(personObject).then((newPerson) => {
        setPersons([...persons, newPerson]);
        setMessage({
          type: "success",
          content: `Added ${newPerson.name} to the list`
        });
        setNewName("");
        setNewNumber("");
        clearNotification();
      });
    }
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(searchName.toLowerCase())
  );

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
    setNumberFormat(/0[0-9]{1,2}-[0-9]{7,}/.test(event.target.value));
  };

  const handleSearchChange = (event) => {
    setSearchName(event.target.value);
  };

  const handleDeletePerson = (id) => {
    const deletedPerson = persons.find((person) => person.id === id);
    if (
      window.confirm(
        `Do you want to delete ${deletedPerson.name} from the list?`
      )
    ) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(
            persons.filter((person) => person.id !== deletedPerson.id)
          );
          setMessage({
            type: "delete",
            content: `${deletedPerson.name} has been deleted from the list`
          });
          clearNotification();
        })
        .catch((error) => {
          setMessage({
            type: "error",
            content: `${deletedPerson.name} has already been removed from server`
          });
          clearNotification();
        });
    }
  };

  const clearNotification = () => {
    setTimeout(() => {
      setMessage({ type: null, content: null });
    }, 4000);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter searchName={searchName} handleSearchChange={handleSearchChange} />
      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        numberFormat={numberFormat}
      />
      <h3>Numbers</h3>
      <Persons
        personsToShow={personsToShow}
        onDeletePerson={handleDeletePerson}
      />
    </div>
  );
};

export default App;
