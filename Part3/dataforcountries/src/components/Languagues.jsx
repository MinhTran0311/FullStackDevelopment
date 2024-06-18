const Languages = ({ languages }) => {
  return (
    <>
      <h3>languages</h3>

      <ul>
        {Object.entries(languages).map(([code, language]) => (
          <li key={code}>{language} </li>
        ))}
      </ul>
    </>
  );
};

export default Languages;
