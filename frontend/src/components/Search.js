import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const placeholders = [
  "Search for laptops, phones...",
  "Find the best deals today...",
  "Discover trending products...",
  "Try: headphones, watches...",
];

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";

export default function Search() {
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Cycle placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchSuggestions = useCallback(async (q) => {
    if (!q || q.length < 2) { setSuggestions([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products?keyword=${encodeURIComponent(q)}&limit=6`);
      const data = await res.json();
      if (data.success) {
        setSuggestions(data.products || []);
        setShowSuggestions(true);
      }
    } catch (_) {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setKeyword(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  const searchHandler = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (keyword.trim()) {
      navigate("/?keyword=" + encodeURIComponent(keyword.trim()));
    } else {
      navigate("/");
    }
  };

  const handleSuggestionClick = (product) => {
    setKeyword(product.name);
    setShowSuggestions(false);
    navigate(`/product/${product._id}`);
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "100%" }}>
      <form onSubmit={searchHandler} className="w-100" style={{ position: "relative" }}>
        <i
          className="fa fa-search"
          style={{
            position: "absolute", left: "0.85rem", top: "50%",
            transform: "translateY(-50%)",
            color: isFocused ? "var(--secondary)" : "rgba(255,255,255,0.5)",
            zIndex: 20, fontSize: "0.85rem", transition: "all 0.3s ease",
          }}
        />
        <input
          type="text"
          id="search_field"
          className="search-input-modern"
          placeholder={placeholders[placeholderIdx]}
          value={keyword}
          onChange={handleChange}
          onFocus={() => { setIsFocused(true); if (keyword.length >= 2) setShowSuggestions(true); }}
          onBlur={() => { setIsFocused(false); setPlaceholderIdx((i) => (i + 1) % placeholders.length); }}
          autoComplete="off"
        />
        {keyword && (
          <button
            type="button"
            onClick={() => { setKeyword(""); setSuggestions([]); setShowSuggestions(false); }}
            style={{
              position: "absolute", right: "0.6rem", top: "50%",
              transform: "translateY(-50%)", background: "none", border: "none",
              color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "0.85rem",
              padding: "0.2rem 0.4rem", zIndex: 20,
            }}
          >
            <i className="fa fa-times" />
          </button>
        )}
      </form>

      {showSuggestions && (suggestions.length > 0 || loading) && (
        <div
          style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
            background: "rgba(15,23,42,0.97)", backdropFilter: "blur(16px)",
            borderRadius: "12px", boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.08)", zIndex: 9999,
            overflow: "hidden", maxHeight: "340px", overflowY: "auto",
          }}
        >
          {loading ? (
            <div style={{ padding: "1rem", textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>
              <i className="fas fa-spinner fa-spin" style={{ marginRight: "0.5rem" }} />
              Searching...
            </div>
          ) : (
            <>
              <div style={{ padding: "0.6rem 1rem 0.3rem", fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Suggestions
              </div>
              {suggestions.map((p) => {
                const imgSrc = (() => {
                  const img = p.images?.[0];
                  const src = img ? (img.url || img.image || (typeof img === "string" ? img : "")) : "";
                  if (src.startsWith("/uploads")) {
                    return (process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1").split("/api")[0] + src;
                  }
                  return src || "/images/products/1.jpg";
                })();
                return (
                  <button
                    key={p._id}
                    onMouseDown={() => handleSuggestionClick(p)}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.75rem",
                      width: "100%", padding: "0.7rem 1rem", background: "none",
                      border: "none", cursor: "pointer", textAlign: "left",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      transition: "background 0.15s ease", color: "white",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                  >
                    <img
                      src={imgSrc} alt={p.name}
                      style={{ width: "40px", height: "40px", objectFit: "contain", borderRadius: "8px", background: "#fff", flexShrink: 0, padding: "4px" }}
                      onError={(e) => { e.target.src = "/images/products/1.jpg"; }}
                    />
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ fontSize: "0.88rem", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--secondary)", fontWeight: 600 }}>${p.price} · {p.category}</div>
                    </div>
                    <i className="fas fa-arrow-right" style={{ marginLeft: "auto", fontSize: "0.7rem", color: "rgba(255,255,255,0.25)" }} />
                  </button>
                );
              })}
              <button
                onMouseDown={() => { setShowSuggestions(false); navigate("/?keyword=" + encodeURIComponent(keyword)); }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                  width: "100%", padding: "0.75rem 1rem", background: "rgba(254,189,105,0.08)",
                  border: "none", cursor: "pointer", color: "var(--secondary)",
                  fontWeight: 700, fontSize: "0.85rem",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(254,189,105,0.15)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(254,189,105,0.08)"}
              >
                <i className="fa fa-search" />
                View all results for &nbsp;<strong>"{keyword}"</strong>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
