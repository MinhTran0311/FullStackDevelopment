import { useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import { useEffect } from "react";
import personService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [notiMessage, setNotiMessage] = useState({
    message: "",
    isSuccess: false,
  });

  const getPersons = () => {
    personService
      .getAllPersons()
      .then((initialPersons) => setPersons(initialPersons))
      .catch((error) => {
        console.error(error);
        showMessage("An error occurred while getting the persons", false);
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
        showMessage(`Added ${returnedPerson.name}`, true);
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewPhone("");
        event.target.reset();
      })
      .catch((error) => {
        showMessage(error.response.data.error, false);
      });
  };

  const showMessage = (message, isSuccess) => {
    setNotiMessage({
      message: message,
      isSuccess: isSuccess,
    });
    setTimeout(() => {
      setNotiMessage({ ...notiMessage, message: null });
    }, 5000);
  };

  const onDeletePerson = (id) => {
    const name = persons.find((e) => e.id === id).name;
    const confirmDelete = window.confirm("Delete " + name + "?");

    if (confirmDelete) {
      personService
        .deletePerson(id)
        .then((returnedPerson) => {
          setPersons(persons.filter((p) => p.id !== returnedPerson.id));
        })
        .catch((error) => {
          console.error(error);
          showMessage(
            "Information of " + name + " has been removed from server",
            false
          );
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
        showMessage(error.response.data.error, false);
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
      <Notification notiMessage={notiMessage} />
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
