"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import "./style.css";
import { DashboardHeader } from "@/features/home/Dashboard/DashboardHeader";
import { searchVector, addToCart } from "@/api/Api";
import { useCart } from "@/api/stateContext";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";
import { sortAndFilterSearchResults } from "@/utils/searchUtils";

export const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshCartCount } = useCart();

  const queryFromUrl = searchParams.get("q") || "";
  const queryFromState = location.state?.query || location.state?.product?.name || "";
  const initialQuery = queryFromUrl || queryFromState || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [sortBySavings, setSortBySavings] = useState(true);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    if (queryFromUrl) {
      setSearchQuery(queryFromUrl);
    }
  }, [queryFromUrl]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const data = await searchVector(searchQuery.trim());
        if (Array.isArray(data)) {
          const sorted = sortAndFilterSearchResults(data, searchQuery.trim());
          setResults(sorted);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Error fetching search results:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchQuery]);

  const uniqueResults = React.useMemo(() => {
    const seenPids = new Set();
    const uniqueList = [];
    for (const item of results) {
      const pid = item.product_id || item.id;
      const nameKey = (item.product_name || item.name || "").toLowerCase().trim();
      if (pid && !seenPids.has(pid) && !seenPids.has(nameKey)) {
        seenPids.add(pid);
        seenPids.add(nameKey);
        uniqueList.push(item);
      }
    }
    return uniqueList;
  }, [results]);

  const sortedResults = React.useMemo(() => {
    if (!sortBySavings) return uniqueResults;
    return [...uniqueResults].sort((a, b) => {
      const savA = a.recommended_product?.savings_pct || 0;
      const savB = b.recommended_product?.savings_pct || 0;
      return savB - savA;
    });
  }, [uniqueResults, sortBySavings]);

  const displayedResults = sortedResults.slice(0, visibleCount);

  const handleAddToCart = async (product, e) => {
    if (e) e.stopPropagation();
    if (!product || !product.product_id) return;
    setAddingId(product.product_id);
    try {
      await addToCart(product.product_id, 0, 1, navigate);
      if (refreshCartCount) refreshCartCount();
      Swal.fire({
        title: "Added to Cart!",
        text: `${product.product_name || product.name || "Item"} added to your cart.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error adding to cart:", err);
    } finally {
      setAddingId(null);
    }
  };

  const handleProductClick = (prod) => {
    if (!prod || !prod.product_name_url) return;
    navigate(`/product/${prod.product_name_url}`, { state: { product: prod, from: 'search', searchQuery } });
  };

  return (
    <>
      <Helmet>
        <title>Search Results for "{searchQuery}" | Medingen</title>
        <meta
          name="description"
          content={`Find generic medicine alternatives and compare prices for ${searchQuery} on Medingen.`}
        />
      </Helmet>

      <div className="search-results-page-container">
        {/* Main Dashboard Header */}
        <DashboardHeader />

        <div className="search-results-content-wrapper">
          {/* Trust Badges Bar */}
          <div className="search-trust-badges-bar">
            {/* Item 1: WHO GMP CERTIFIED */}
            <div className="trust-badge-item">
              <div className="trust-badge-icon-bg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#7c3aed">
                  <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82 1.89 3.2 3.4-1.46 3.4 1.46 1.89-3.2 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z"/>
                </svg>
              </div>
              <span className="trust-badge-text">WHO GMP CERTIFIED</span>
            </div>

            <div className="trust-badge-divider" />

            {/* Item 2: DOCTORS APPROVED */}
            <div className="trust-badge-item">
              <div className="trust-badge-icon-bg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="6.5" width="18" height="13.5" rx="2.5" ry="2.5"></rect>
                  <path d="M16 6.5V4.5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path>
                  <line x1="12" y1="10.5" x2="12" y2="16"></line>
                  <line x1="9.25" y1="13.25" x2="14.75" y2="13.25"></line>
                </svg>
              </div>
              <span className="trust-badge-text">DOCTORS APPROVED</span>
            </div>

            <div className="trust-badge-divider" />

            {/* Item 3: UPTO 80% SAVINGS */}
            <div className="trust-badge-item">
              <div className="trust-badge-icon-bg">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8.8 3.5 2 4.6V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2h4v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3.5c1.2-1.1 2-2.8 2-4.5 0-3-1.5-6-3-6z"></path>
                  <circle cx="16" cy="10.5" r="1" fill="#7c3aed"></circle>
                  <path d="M9.5 6.5h4.5"></path>
                </svg>
              </div>
              <span className="trust-badge-text">UPTO 80% SAVINGS</span>
            </div>

            <div className="trust-badge-divider" />

            {/* Item 4: FAST DELIVERY */}
            <div className="trust-badge-item">
              <div className="trust-badge-icon-bg">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="14" height="12" rx="1.5"></rect>
                  <polygon points="15 8 19 8 22 11 22 16 15 16 15 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.2" fill="none"></circle>
                  <circle cx="17.5" cy="18.5" r="2.2" fill="none"></circle>
                </svg>
              </div>
              <span className="trust-badge-text">FAST DELIVERY</span>
            </div>

            <div className="trust-badge-divider" />

            {/* Item 5: Google Rating Pill */}
            <a
              href="https://search.google.com/local/reviews?placeid=ChIJ73ps481hUjoR8TGoCm4jvAc"
              target="_blank"
              rel="noopener noreferrer"
              className="google-rating-pill"
            >
              <img src="/google.svg" alt="Google" className="google-pill-logo" />
              <span className="google-pill-rating-text">Rated 4.9</span>
              <div className="google-pill-stars">
                ★★★★★
              </div>
            </a>
          </div>

          {/* THE GENERIC ADVANTAGE Hero Banner (Desktop) */}
          <div className="generic-advantage-hero-banner">
            <div className="hero-banner-shield-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <line x1="12" y1="8" x2="12" y2="14"></line>
                <line x1="9" y1="11" x2="15" y2="11"></line>
              </svg>
            </div>
            <div className="hero-banner-info">
              <h2 className="hero-banner-title">THE GENERIC ADVANTAGE</h2>
              <ul className="hero-banner-bullets">
                <li><span className="check-mark">✔</span> Exact same active ingredients as expensive brands</li>
                <li><span className="check-mark">✔</span> Clinically tested for identical safety and quality</li>
                <li><span className="check-mark">✔</span> Guaranteed savings of up to <strong className="highlight-tag">80% or more</strong></li>
              </ul>
            </div>
          </div>

          {/* Results Summary Header */}
          <div className="search-results-summary-header">
            <div className="results-count-text">
              Showing <strong>{displayedResults.length}</strong> of <strong>{results.length}</strong> results for "<strong>{searchQuery}</strong>"
            </div>
            <button
              className={`sort-by-savings-btn ${sortBySavings ? "active" : ""}`}
              onClick={() => setSortBySavings(!sortBySavings)}
            >
              ⇅ SORT BY SAVINGS
            </button>
          </div>

          {/* Loading / Error / Empty States */}
          {loading ? (
            <div className="search-page-loader">
              <div className="loader-spinner"></div>
              <p>Fetching generic alternatives for "{searchQuery}"...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="search-page-no-results">
              <h3>No direct matches found for "{searchQuery}"</h3>
              <p>Try searching by salt name (e.g., <em>Paracetamol</em>, <em>Pantoprazole</em>) or request us on WhatsApp!</p>
              <button
                className="no-res-whatsapp-btn"
                onClick={() => {
                  const msg = encodeURIComponent(`Hello! I couldn't find "${searchQuery}" on Medingen. Can you please assist me?`);
                  window.open(`https://wa.me/+917090123709?text=${msg}`, "_blank");
                }}
              >
                Request Product on WhatsApp
              </button>
            </div>
          ) : (
            /* Results Cards List */
            <div className="search-results-cards-list">
              {displayedResults.map((item, idx) => {
                const rec = item.recommended_product;
                const hasRec = Boolean(rec && rec.product_name);
                const sName = item.product_name || item.name || "";
                const sMfg = item.manufacturer || "";
                const sPkg = item.packaging || "";
                const sComp = item.composition || item.salt_name || "";
                const sPrice = item.product_pricing_new;

                const recMfg = rec?.manufacturer || "";
                const recPkg = rec?.packaging || "";
                const recComp = rec?.composition || rec?.salt_name || sComp || "";

                const sImg = item.image
                  ? (item.image.startsWith("http") ? item.image : `https://d1dh0rr5xj2p49.cloudfront.net/products/${item.image}`)
                  : "/medicine-icon.svg";

                return (
                  <div key={`res-row-${item.product_id || idx}`} className={`results-pair-card-row ${hasRec ? "has-recommended" : "single-item"}`}>
                    {/* Searched Product (Left Side) */}
                    <div className="searched-item-card" onClick={() => handleProductClick(item)}>
                      <div className="card-top-tag text-searched">SEARCHED MEDICINE</div>
                      <div className="card-main-content">
                        <div className="product-thumb-container">
                          <img src={sImg} alt={sName} className="product-thumb-img" />
                        </div>
                        <div className="product-details-container">
                          <h3 className="product-title">{sName}</h3>
                          {sComp && (
                            <div className="product-composition-pill" title={sComp}>
                              {sComp}
                            </div>
                          )}
                          {(sComp || sPkg) && (
                            <div className="product-subtext">
                              {sComp && <span className="mfg-name">{sComp}</span>}
                              {sComp && sPkg && <span className="subtext-dot"> • </span>}
                              {sPkg && <span className="pkg-info">{sPkg}</span>}
                            </div>
                          )}
                          <div className="product-price-val">₹{sPrice !== null && sPrice !== undefined ? sPrice : "N/A"}</div>
                        </div>
                      </div>
                    </div>

                    {/* Generic Alternative Product (Right Side) */}
                    {hasRec && (
                      <div className="recommended-item-card" onClick={() => handleProductClick(rec)}>
                        <div className="card-top-tag text-recommended">
                          GENERIC ALTERNATIVE
                          {rec.savings_pct > 0 && <span className="savings-pill-top">-{rec.savings_pct}%</span>}
                        </div>
                        <div className="card-main-content">
                          <div className="product-thumb-container">
                            <img
                              src={
                                rec.image
                                  ? (rec.image.startsWith("http") ? rec.image : `https://d1dh0rr5xj2p49.cloudfront.net/products/${rec.image}`)
                                  : "/medicine-icon.svg"
                              }
                              alt={rec.product_name}
                              className="product-thumb-img"
                            />
                          </div>
                          <div className="product-details-container">
                            <h3 className="product-title">{rec.product_name}</h3>
                            {recComp && (
                              <div className="product-composition-pill" title={recComp}>
                                {recComp}
                              </div>
                            )}
                            {(recComp || recPkg) && (
                              <div className="product-subtext">
                                {recComp && <span className="mfg-name">{recComp}</span>}
                                {recComp && recPkg && <span className="subtext-dot"> • </span>}
                                {recPkg && <span className="pkg-info">{recPkg}</span>}
                              </div>
                            )}
                            <div className="rec-price-container">
                              <span className="rec-discounted-price">₹{rec.product_pricing_new}</span>
                              {rec.product_pricing_old > rec.product_pricing_new && (
                                <span className="rec-original-mrp">₹{rec.product_pricing_old}</span>
                              )}
                              {rec.savings_pct > 0 && (
                                <span className="rec-savings-badge">{rec.savings_pct}% Savings</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="card-bottom-actions">
                          <button
                            className="we-recommend-btn"
                            onClick={(e) => handleAddToCart(rec, e)}
                            disabled={addingId === rec.product_id}
                          >
                            {addingId === rec.product_id ? "Adding..." : "+ Add"}
                          </button>
                          <span className="we-recommend-tag">WE RECOMMEND</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More Results Button */}
          {displayedResults.length < results.length && (
            <div className="load-more-container">
              <button
                className="load-more-results-btn"
                onClick={() => setVisibleCount((prev) => prev + 10)}
              >
                Load More Results
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

