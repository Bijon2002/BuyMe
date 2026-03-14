import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate('/search?keyword=' + keyword);
    }
  };

  return (
    <form onSubmit={searchHandler} className="w-100" style={{ position: 'relative' }}>
       <i className="fa fa-search" style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.7)', zIndex: 20 }}></i>
      <input
        type="text"
        id="search_field"
        className="search-input-modern"
        placeholder="Search for amazing products..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
    </form>
  );
}
