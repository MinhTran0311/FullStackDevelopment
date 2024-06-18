const Filter = ({ searchTerm, handlerFilterChange }) => {
  return <div>
    filter shown with <input value={searchTerm} onChange={handlerFilterChange} />
  </div>
};

export default Filter;
