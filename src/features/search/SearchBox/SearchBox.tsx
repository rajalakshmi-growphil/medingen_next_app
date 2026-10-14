"use client";
import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import { Helmet } from "react-helmet";
import { searchVector } from "@/api/Api";
import Navigation from "@/features/home/Dashboard/Navigation";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { trackSearch } from "@/utils/analytics";
import { sortAndFilterSearchResults } from "@/utils/searchUtils";


export const SearchBox = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const location = useLocation();

  const isPrerender = typeof window !== "undefined" &&
    (window.__PRERENDER__ || (navigator.userAgent && navigator.userAgent.includes("ReactSnap")));

  useEffect(() => {
    if (location.state?.voiceSearch) {
      setSearchText(location.state.voiceSearch);
    }
    if (!isPrerender) {
      searchInputRef.current?.focus();
    }
  }, [location.state, isPrerender]);


  useEffect(() => {
    if (location.state?.category) {
      setSearchText(location.state.category + ":");
    }
    if (!isPrerender) {
      searchInputRef.current?.focus();
    }
  }, [isPrerender]);


  useEffect(() => {
    let isCurrent = true;
    const fetchProducts = async () => {
      if (isPrerender) return;
      if (searchText.length > 1) {
        setLoading(true);
        setError("");

        try {
          const results = await searchVector(searchText);
          if (!isCurrent) return;

          if (Array.isArray(results)) {
            const q = searchText.toLowerCase().trim();
            const queryWords = q.split(/\s+/).filter(Boolean);

            const isTextMatch = (product) => {
              const name = (product.product_name || product.name || "").toLowerCase();
              const salt = (product.salt_name || "").toLowerCase();
              const composition = (product.composition || "").toLowerCase();

              if (name.includes(q) || salt.includes(q) || composition.includes(q)) {
                return true;
              }

              if (queryWords.length > 0 && queryWords.every(word => name.includes(word) || salt.includes(word) || composition.includes(word))) {
                return true;
              }

              if (queryWords.length === 1 && q.length >= 2) {
                const prefix = q;
                const nameWords = name.split(/[\s\-\/\+\,\(\)]+/).filter(Boolean);
                const saltWords = salt.split(/[\s\-\/\+\,\(\)]+/).filter(Boolean);
                if (nameWords.some(w => w.startsWith(prefix)) || saltWords.some(w => w.startsWith(prefix))) {
                  return true;
                }
              }
              return false;
            };

            const textMatches = results.filter(isTextMatch);
            const filteredResults = textMatches.length > 0 ? textMatches : results;

            const validProducts = filteredResults.filter(p => p.product_pricing_new !== null);
            const sortedProducts = sortAndFilterSearchResults(validProducts, searchText);

            if (!isCurrent) return;
            setFilteredSuggestions(sortedProducts);
            setTotalPages(1);
          } else {
            if (!isCurrent) return;
            setFilteredSuggestions([]);
            setTotalPages(1);
          }
        } catch (error) {
          if (!isCurrent) return;
          setError("Failed to fetch products. Please try again.");
        } finally {
          if (isCurrent) setLoading(false);
        }
      } else {
        setFilteredSuggestions([]);
      }
    };

    fetchProducts();
    return () => {
      isCurrent = false;
    };
  }, [searchText]);

  const handleChange = (event) => {
    setSearchText(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    trackSearch(suggestion.product_name);
    // Navigate directly to SearchViewMedicine
    navigate(`/product/${suggestion.product_name_url}`, { state: { product: suggestion }, replace: false });
  };

  return (
    <div className="search-box">
      <Helmet>
        <title>Search Medicines Online | Medingen Pharmacy</title>
        <meta name="description" content="Search and buy generic medicines online on Medingen. Find affordable substitutes for any brand and save up to 80%." />
        <link rel="canonical" href="https://medingen.in/searchbox" />
        <meta property="og:title" content="Search Medicines Online | Medingen Pharmacy" />
        <meta property="og:description" content="Search and buy generic medicines online on Medingen. Find affordable substitutes for any brand and save up to 80%." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://medingen.in/searchbox" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Search Medicines Online | Medingen Pharmacy" />
        <meta name="twitter:description" content="Search and buy generic medicines online on Medingen. Find affordable substitutes for any brand and save up to 80%." />
      </Helmet>
      <div className="overlap">
        <div className="frame">
          <div className="overlap-group">
            <div className="group"></div>
            <div className="frame-2">
              <Link to="/">
                <img className="line-arrow-chevron" alt="Line arrow chevron" src="/line-arrow-chevron-left.svg" fetchPriority="high" />
              </Link>
              <div className="text-wrapper">Search</div>
            </div>
          </div>
        </div>
        <div className="div-wrapper">
          <div className="frame-wrapper">
            <div className="frame-3">
              <div className="frame-4">
                <div className="frame-5">
                  <input
                    type="text"
                    placeholder="Type a medicine name ..."
                    className="text-wrapper-2"
                    name="search_text"
                    value={searchText}
                    id="search_text"
                    onChange={handleChange}
                    ref={searchInputRef} // Attach the ref to the input element
                  />
                </div>
              </div>
            </div>
          </div>
          {/* <img className="img-2" alt="Fluent mic" src="/fluent-mic-20-regular.svg" fetchPriority="high" /> */}
        </div>
      </div>
      {(searchText.length > 1 ?
        (<>
          <div className="overlap-3" >
            <div className="frame-8">
              {loading ? (
                <div className="loader">Loading...</div>
              ) : error ? (
                <div className="error">{error}</div>
              ) : (
                <>
                  {filteredSuggestions.length === 0 && searchText.length > 1 ? (
                    <div className="no-product-found-container">
                      <h3 className="no-product-text">
                        Your Product Not Found <span>Request Us</span>
                      </h3>
                      <div
                        onClick={() => {
                          const message = `Hello! I couldn’t find the product "${searchText}" on your website. Can you please help me?`;
                          const encodedMessage = encodeURIComponent(message);
                          window.open(`https://wa.me/+917090123709?text=${encodedMessage}`, "_blank");
                        }}
                        rel="noopener noreferrer"
                        className="whatsapp-request-btn"
                      >
                        <img
                          className="whatsapp-icon"
                          alt="WhatsApp"
                          src="/whatsapp.png"
                        />
                        <span>Request</span>
                      </div>
                    </div>
                  ) : null}


                  {filteredSuggestions.length > 0 && (
                    <div className="text-wrapper-5">Suggestions for "{searchText}"</div>
                  )}
                  {filteredSuggestions.length > 0 && (
                    <div className="search-suggestions-list">
                      {filteredSuggestions.map((suggestion) => (
                        <div key={suggestion.product_id} className="suggestion" onClick={() => { handleSelectSuggestion(suggestion) }} >
                          <div>
                            <div className="product-name">{suggestion.product_name}</div>
                            {(suggestion.composition || suggestion.salt_name) && (
                              <div className="product-composition-sub">{suggestion.composition || suggestion.salt_name}</div>
                            )}
                          </div>
                          <div className="product-pricing">
                            <div className="price">₹ {suggestion.product_pricing_new}</div>
                            <div className="icon">
                              <img className="medicine-icon" alt="Line arrow chevron" src={suggestion.category_outline_url ? "https://d1dh0rr5xj2p49.cloudfront.net/categories/" + suggestion.category_outline_url : "/medicine-icon.svg"} fetchPriority="high" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {totalPages > 1 && (
                    <div className="pagination">
                      <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                        Previous
                      </button>
                      <span>
                        Page {currentPage} of {totalPages}
                      </span>
                      <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </>)
        : null)
      }
      <Navigation />
    </div>
  );
};

