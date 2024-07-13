/* eslint-disable react/prop-types */
const AnecdoteForm = ({ onCreate }) => {

  const handleSubmit = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = '';
    onCreate(content);
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={handleSubmit}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
