import { useState } from "react";
import { useNavigate } from "react-router-dom";

const placeholders = [
  "Search for premium electronics...",
  "Find the best deals today...",
  "Discover trending products...",
  "Explore our collections...",
];

export default function Search() {
  const [keyword, setKeyword] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      // Navigate to home with keyword param so Home.js fetches the right products
      navigate('/?keyword=' + encodeURIComponent(keyword.trim()));
    } else {
      navigate('/');
    }
  };

  // Cycle placeholder on blur
  const handleBlur = () => {
    setIsFocused(false);
    setPlaceholderIdx((prev) => (prev + 1) % placeholders.length);
  };

  return (
    <form onSubmit={searchHandler} className="w-100" style={{ position: 'relative' }}>
       <i className="fa fa-search" style={{ 
         position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', 
         color: isFocused ? 'var(--secondary)' : 'rgba(255,255,255,0.7)', 
         zIndex: 20,
         transition: 'all 0.3s ease'
       }}></i>
      <input
        type="text"
        id="search_field"
        className="search-input-modern"
        placeholder={placeholders[placeholderIdx]}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
      />
    </form>
  );
}
