import { useState } from 'react';
import { toast } from 'react-toastify';

import './Searchbar.css';

function Searchbar({ onFormSubmit }) {
  const [query, setQuery] = useState('');

  const handleQueryChange = e => {
    setQuery(e.currentTarget.value.toLowerCase());
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (query.trim() === '') {
      toast('Type in your query');
      return;
    }

    onFormSubmit(query);
    setQuery('');
  };

  return (
    <header className="Searchbar">
      <form className="SearchForm" onSubmit={handleSubmit}>
        <button type="submit" className="SearchForm-button">
          <span className="SearchForm-button-label">Search</span>
        </button>

        <input
          className="SearchForm-input"
          type="text"
          name="query"
          value={query}
          onChange={handleQueryChange}
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </form>
    </header>
  );
}

export default Searchbar;
