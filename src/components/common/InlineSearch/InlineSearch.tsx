"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import "./InlineSearch.css";
import { searchVector } from "@/api/Api";
import { useNavigate } from "react-router-dom";
import { trackSearch } from "@/utils/analytics";
import { sortAndFilterSearchResults } from "@/utils/searchUtils";

export const InlineSearch = ({ 
    placeholderText = "Search medicine, medical products", 
    className = "", 
    variant = "hero",
    searchText: externalSearchText,
    setSearchText: externalSetSearchText,
    showDropdown: externalShowDropdown,
    setShowDropdown: externalSetShowDropdown,
    scrollContainerRef
}) => {
    const [localSearchText, setLocalSearchText] = useState("");
    const searchText = externalSearchText !== undefined ? externalSearchText : localSearchText;
    const setSearchText = externalSetSearchText || setLocalSearchText;

    const [localShowDropdown, setLocalShowDropdown] = useState(false);
    const showDropdown = externalShowDropdown !== undefined ? externalShowDropdown : localShowDropdown;
    const setShowDropdown = externalSetShowDropdown || setLocalShowDropdown;

    const isPrerender = typeof window !== "undefined" &&
      (window.__PRERENDER__ || (navigator.userAgent && navigator.userAgent.includes("ReactSnap")));

    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const navigate = useNavigate();
    const searchContainerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        const handleScroll = () => {
            if (showDropdown) {
                setShowDropdown(false);
            }
        };

        const scrollEl = scrollContainerRef?.current || window;

        document.addEventListener("mousedown", handleClickOutside);
        scrollEl.addEventListener("scroll", handleScroll, { passive: true });
        if (scrollEl !== window) {
            window.addEventListener("scroll", handleScroll, { passive: true });
        }
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            scrollEl.removeEventListener("scroll", handleScroll);
            if (scrollEl !== window) {
                window.removeEventListener("scroll", handleScroll);
            }
        };
    }, [showDropdown, setShowDropdown, scrollContainerRef]);

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

                            // Only fallback to prefix matching for single-word queries
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

                        const seen = new Set();
                        const uniqueProducts = [];
                        for (const p of validProducts) {
                            const id = p.product_id || p.id;
                            const name = (p.product_name || p.name || "").toLowerCase().trim();
                            if (id && !seen.has(id) && !seen.has(name)) {
                                seen.add(id);
                                seen.add(name);
                                uniqueProducts.push(p);
                            }
                        }

                        const sortedSuggestions = sortAndFilterSearchResults(uniqueProducts, searchText);
                        if (!isCurrent) return;
                        setFilteredSuggestions(sortedSuggestions);
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
                setShowDropdown(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            fetchProducts();
        }, 300);

        return () => {
            isCurrent = false;
            clearTimeout(debounceTimer);
        };

    }, [searchText, isPrerender]);

    // Generate top quick text suggestions from results
    const textSuggestions = useMemo(() => {
        if (!searchText || filteredSuggestions.length === 0) return [];
        const set = new Set();
        for (const p of filteredSuggestions) {
            const name = p.product_name || p.name || "";
            if (name) set.add(name);
            const salt = p.salt_name || p.composition || "";
            if (salt && salt.length < 30) set.add(salt);
            if (set.size >= 3) break;
        }
        return Array.from(set).slice(0, 3);
    }, [filteredSuggestions, searchText]);

    const handleChange = (event) => {
        setSearchText(event.target.value);
        setCurrentPage(1);
        if (event.target.value.length > 1) {
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    };

    const handleClearSearch = (e) => {
        e.stopPropagation();
        setSearchText("");
        setShowDropdown(false);
    };

    const handleSelectProduct = (product) => {
        if (!product || !product.product_name_url) return;
        trackSearch(product.product_name || product.name);
        setShowDropdown(false);
        navigate(`/product/${product.product_name_url}`, { state: { product, from: 'search', searchQuery: searchText }, replace: false });
    };

    const handleSelectTextSuggestion = (text) => {
        setSearchText(text);
        setShowDropdown(true);
    };

    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        const query = searchText.trim();
        if (query.length > 0) {
            trackSearch(query);
            setShowDropdown(false);
            navigate(`/search-results?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className={`inline-search-container variant-${variant} ${className}`} ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} className="inline-search-bar" onClick={() => { if (searchText.length > 1) setShowDropdown(true); }}>
                <div className="inline-search-left-icon" onClick={handleSearchSubmit}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder={placeholderText}
                    className="inline-search-input"
                    value={searchText}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearchSubmit(e);
                        }
                    }}
                />
                {searchText.length > 0 ? (
                    <div className="inline-search-clear-btn" onClick={handleClearSearch} title="Clear search">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </div>
                ) : (
                    <div className="inline-search-button" onClick={handleSearchSubmit}>
                        <img src="/search.svg" alt="Search" />
                    </div>
                )}
            </form>

            {showDropdown && searchText.length > 1 && (
                <div className="inline-search-dropdown">
                    <div className="inline-search-dropdown-content">
                        {loading ? (
                            <div className="inline-loader">Searching medicines...</div>
                        ) : error ? (
                            <div className="inline-error">{error}</div>
                        ) : (
                            <>
                                {filteredSuggestions.length === 0 && (
                                    <div className="inline-no-product">
                                        <h3 className="inline-no-product-text">
                                            Your Product Not Found <span>Request Us</span>
                                        </h3>
                                        <div
                                            onClick={() => {
                                                const message = `Hello! I couldn't find the product "${searchText}" on your website. Can you please help me?`;
                                                const encodedMessage = encodeURIComponent(message);
                                                window.open(`https://wa.me/+917090123709?text=${encodedMessage}`, "_blank");
                                            }}
                                            className="inline-whatsapp-btn"
                                        >
                                            <img className="inline-whatsapp-icon" alt="WhatsApp" src="/whatsapp.png" />
                                            <span>Request</span>
                                        </div>
                                    </div>
                                )}

                                {/* Top Quick Text Suggestions List */}
                                {textSuggestions.length > 0 && (
                                    <div className="inline-quick-suggestions-section">
                                        {textSuggestions.map((textItem, idx) => (
                                            <div 
                                                key={`txt-sug-${idx}`} 
                                                className="inline-quick-suggestion-item" 
                                                onMouseDown={() => handleSelectTextSuggestion(textItem)}
                                            >
                                                <span className="inline-quick-text">{textItem}</span>
                                                <svg className="inline-quick-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="11" cy="11" r="8"></circle>
                                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                                </svg>
                                            </div>
                                        ))}
                                        <div className="inline-see-all-suggestions" onMouseDown={() => handleSearchSubmit()}>
                                            See All Suggestions &rsaquo;
                                        </div>
                                    </div>
                                )}

                                {/* Product Paired Cards List */}
                                {filteredSuggestions.length > 0 && (
                                    <div className="inline-search-product-pairs-list">
                                        {filteredSuggestions.slice(0, 5).map((suggestion, index) => {
                                            const rec = suggestion.recommended_product;
                                            const hasRec = Boolean(rec && rec.product_name);
                                            const sName = suggestion.product_name || suggestion.name || "";
                                            const sPkg = suggestion.packaging || "";
                                            const sComp = suggestion.composition || suggestion.salt_name || suggestion.product_salt || suggestion.product_composition || "";
                                            const sPrice = suggestion.product_pricing_new;

                                            const recPkg = rec?.packaging || "";
                                            const recComp = rec?.composition || rec?.salt_name || rec?.product_salt || rec?.product_composition || sComp || "";

                                             return (
                                                <div key={`pair-${suggestion.product_id || index}`} className={`inline-product-pair-row ${hasRec ? "has-recommended" : "single-card"}`}>
                                                    {/* Searched Product (Left Card) */}
                                                    <div 
                                                        className="inline-card-searched" 
                                                        onMouseDown={() => handleSelectProduct(suggestion)}
                                                    >
                                                        <div>
                                                            <div className="inline-card-title">{sName}</div>
                                                            {(sComp || sPkg) && (
                                                                <div className="inline-card-subtext">
                                                                    {sComp && <div className="inline-card-composition" title={sComp}>{sComp}</div>}
                                                                    {sPkg && <div className="inline-pkg">{sPkg}</div>}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="inline-card-price">
                                                            ₹{sPrice !== null && sPrice !== undefined ? sPrice : "N/A"}
                                                        </div>
                                                    </div>

                                                    {/* Recommended Product (Right Card) */}
                                                    {hasRec && (
                                                        <div 
                                                            className="inline-card-recommended" 
                                                            onMouseDown={() => handleSelectProduct(rec)}
                                                        >
                                                            <div>
                                                                <div className="inline-card-title">{rec.product_name}</div>
                                                                {(recComp || recPkg) && (
                                                                    <div className="inline-card-subtext">
                                                                        {recComp && <div className="inline-card-composition" title={recComp}>{recComp}</div>}
                                                                        {recPkg && <div className="inline-pkg">{recPkg}</div>}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="inline-card-price-row">
                                                                    <span className="inline-rec-price">₹{rec.product_pricing_new}</span>
                                                                    {rec.product_pricing_old > rec.product_pricing_new && (
                                                                        <span className="inline-rec-old-price">₹{rec.product_pricing_old}</span>
                                                                    )}
                                                                    {Boolean(rec.savings_pct && rec.savings_pct > 0) && (
                                                                        <span className="inline-rec-savings">{rec.savings_pct}% Savings</span>
                                                                    )}
                                                                </div>
                                                                <div className="inline-rec-badge">
                                                                    WE RECOMMEND
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};


