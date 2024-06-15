import { useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import { useEffect } from "react";
import personService from "./services/persons";
import Notification from "./components/Notification"

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const getPersons = () => {
    personService
      .getAllPersons()
      .then((initialPersons) => setPersons(initialPersons))
      .catch((error) => {
        console.error(error);
        alert("An error occurred while getting the persons");
      });
  };
  useEffect(getPersons, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find((p) => p.name === newName);
    if (existingPerson) {
      const confirm = window.confirm(
        newName +
          " is already added to phonebook, replace the old number with a new one?"
      );
      if (confirm) {
        updatePerson(existingPerson, newPhone);
      }
      return;
    }

    const person = {
      name: newName,
      number: newPhone,
    };

    personService
      .createPerson(person)
      .then((returnedPerson) => {
        setSuccessMessage(`Added ${returnedPerson.name}`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewPhone("");
        event.target.reset();
      })
      .catch((error) => {
        console.error(error);
        alert("An error occurred while creating the person");
      });
  };

  const onDeletePerson = (id) => {
    const confirmDelete = window.confirm(
      "Delete " + persons.find((e) => e.id === id).name + "?"
    );

    if (confirmDelete) {
      personService
        .deletePerson(id)
        .then((returnedPerson) => {
          setPersons(persons.filter((p) => p.id !== returnedPerson.id));
        })
        .catch((error) => {
          console.error(error);
          alert("An error occurred while deleting the person");
        });
    }
  };

  const updatePerson = (person, newNumber) => {
    const newPerson = { ...person, number: newNumber };

    personService
      .updatePerson(person.id, newPerson)
      .then((returnedPerson) => {
        setPersons(
          persons.map((p) => (p.id !== person.id ? p : returnedPerson))
        );
      })
      .catch((error) => {
        console.error(error);
        alert("An error occurred while updating the person");
      });
  };

  const handlerFilterChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        searchTerm={searchTerm}
        handlerFilterChange={handlerFilterChange}
      />
      <Notification message={successMessage} />
      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newPhone={newPhone}
        handlePhoneChange={handlePhoneChange}
      />
      <h3>Numbers</h3>
      <Persons
        persons={persons}
        searchTerm={searchTerm}
        onDeletePerson={onDeletePerson}
      />
    </div>
  );
};

export default App;
