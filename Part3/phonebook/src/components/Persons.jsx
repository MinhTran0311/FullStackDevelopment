import Person from "./Person";

const Persons = ({ persons, searchTerm, onDeletePerson }) => {
  return (
    <div>
      {persons
        .filter(
          (e) =>
            searchTerm === "" ||
            e.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((p) => (
          <Person key={p.id} name={p.name} number={p.number} onDelete={() => onDeletePerson(p.id)} />
        ))}
    </div>
  );
};

export default Persons;
