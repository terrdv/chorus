import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAutoComplete } from '../services/songAPI';

function Search() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Debounced auto-complete search
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        setIsLoading(true);
        try {
          const response = await getAutoComplete(searchQuery);
          setSuggestions(response.suggestions || []);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Auto-complete error:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion) => {
    setShowSuggestions(false);
    navigate(`/song/${suggestion.id}`);
  };

  return (
    <div className="search-container" ref={searchRef}>
      <div className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for songs, artists, or albums..."
            className="retro-input search-input"
            autoComplete="off"
          />
          {isLoading && <div className="search-loading">⟳</div>}
        </div>
      </div>
      
      {/* Auto-complete suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown" ref={suggestionsRef}>
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <img 
                src={suggestion.cover_image_medium} 
                alt={suggestion.name}
                className="suggestion-image"
              />
              <div className="suggestion-info">
                <div className="suggestion-title">{suggestion.name}</div>
                <div className="suggestion-artist">{suggestion.artist}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
