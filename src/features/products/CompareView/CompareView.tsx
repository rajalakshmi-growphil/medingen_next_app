"use client";
import React, { useState, useEffect } from "react";
import "./style.css";
import Header from "@/features/home/Dashboard/Header";
import Navigation from "@/features/home/Dashboard/Navigation";

const HeaderComponent: any = Header;
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  search_altProducts,
  getUser,
  addToCart,
  requestProduct,
  getAveragePrice,
} from "@/api/Api";
import { useCart, useCompare } from "@/api/stateContext";
import Swal from "sweetalert2";

// Fallback demo product if page loaded without location state
const DEFAULT_PRODUCT = {
  product_id: "telma-40",
  name: "Telma 40 Tablet",
  product_name: "Telma 40 Tablet",
  manufacturer: "Glenmark Pharmaceuticals",
  genericName: "Telmisartan",
  salt_name: "Telmisartan",
  composition: "Telmisartan 40 mg",
  mrp: 145.0,
  ourPrice: 55.0,
  averagePrice: 125.0,
  product_available: 1,
  imageSrc: "https://d1dh0rr5xj2p49.cloudfront.net/products/telma40.png",
};

const DEFAULT_ALTERNATES = [
  {
    product_id: "telvas-40",
    product_name: "Telvas 40 Tablet",
    name: "Telvas 40 Tablet",
    manufacturer: "Cipla",
    salt_name: "Telmisartan",
    genericName: "Telmisartan",
    composition: "Telmisartan 40 mg",
    product_pricing_old: 130.0,
    product_pricing_new: 46.0,
    mrp: 130.0,
    ourPrice: 46.0,
    discountPercent: 35,
    product_available: 1,
    first_image_url: "",
  },
  {
    product_id: "telsar-40",
    product_name: "Telsar 40 Tablet",
    name: "Telsar 40 Tablet",
    manufacturer: "Sun Pharmaceutical",
    salt_name: "Telmisartan",
    genericName: "Telmisartan",
    composition: "Telmisartan 40 mg",
    product_pricing_old: 125.0,
    product_pricing_new: 42.0,
    mrp: 125.0,
    ourPrice: 42.0,
    discountPercent: 42,
    product_available: 1,
    first_image_url: "",
  },
  {
    product_id: "telmin-40",
    product_name: "Telmin 40 Tablet",
    name: "Telmin 40 Tablet",
    manufacturer: "Dr. Reddy's Laboratories",
    salt_name: "Telmisartan",
    genericName: "Telmisartan",
    composition: "Telmisartan 40 mg",
    product_pricing_old: 120.0,
    product_pricing_new: 50.0,
    mrp: 120.0,
    ourPrice: 50.0,
    discountPercent: 28,
    product_available: 1,
    first_image_url: "",
  },
  {
    product_id: "telista-40",
    product_name: "Telista 40 Tablet",
    name: "Telista 40 Tablet",
    manufacturer: "Zydus Cadila",
    salt_name: "Telmisartan",
    genericName: "Telmisartan",
    composition: "Telmisartan 40 mg",
    product_pricing_old: 150.0,
    product_pricing_new: 60.0,
    mrp: 150.0,
    ourPrice: 60.0,
    discountPercent: -10,
    product_available: 0,
    product_request: true,
    first_image_url: "",
  },
];

export const CompareView = ({ embedded = false, state }: { embedded?: boolean; state?: any }) => {
  const location = useLocation();
  const rawProduct = state ? state : location?.state;

  const [currentMedicineInfo, setCurrentMedicineInfo] = useState<any>(DEFAULT_PRODUCT);
  const [compareToAlternateInfo, setCompareToAlternateInfo] = useState<any[]>(DEFAULT_ALTERNATES);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const { refreshCartCount } = (useCart() || {}) as any;
  const { compareProducts = [], dispatchCompare } = (useCompare() || {}) as any;

  const handleBack = () => {
    navigate(-1);
  };

  const handleRequest = async (selectedProduct: any) => {
    const user: any = getUser();
    const isLoggedIn = user?.isLoggedIn;
    if (isLoggedIn) {
      try {
        const customerId = user?.customer_id || user?.id || user?.user_id || 0;
        await requestProduct(selectedProduct.product_id, customerId, 0, "Insert", "PENDING");
        Swal.fire({
          title: "Request Sent",
          text: "Your request has been sent successfully. We will notify you once the product is available.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.error("Error requesting product:", error);
      }
    } else {
      navigate("/login");
    }
  };

  const handleCart = async (selectedProduct: any) => {
    const user = getUser();
    const isLoggedIn = user?.isLoggedIn;
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!user.name) {
      navigate("/create-profile");
      return;
    }

    const { value: quantity } = await Swal.fire({
      title: "Enter Quantity",
      input: "number",
      inputAttributes: {
        min: "1",
        step: "1",
      },
      inputValue: 1,
      showCancelButton: true,
      confirmButtonText: "Add to Cart",
      cancelButtonText: "Cancel",
      icon: "question",
    });

    if (quantity && quantity > 0) {
      try {
        Swal.showLoading();
        await addToCart(
          selectedProduct.product_id,
          0,
          quantity,
          navigate
        );
        if (refreshCartCount) {
          await refreshCartCount();
        }
        Swal.fire({
          title: "Product Added",
          text: "Product has been added to your cart.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.error("Error adding product to cart:", error);
        Swal.fire({
          title: "Error",
          text: "There was an error adding the product to your cart.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      const activeProduct = rawProduct || DEFAULT_PRODUCT;
      if (activeProduct.composition && activeProduct.averagePrice === undefined) {
        try {
          const response = await getAveragePrice(activeProduct.composition);
          setCurrentMedicineInfo({
            ...activeProduct,
            averagePrice: response?.averagePrice
              ? Math.round(parseFloat(response.averagePrice) * 100) / 100
              : activeProduct.averagePrice || 125,
          });
        } catch (e) {
          setCurrentMedicineInfo(activeProduct);
        }
      } else {
        setCurrentMedicineInfo(activeProduct);
      }

      if (compareProducts && compareProducts.length > 0) {
        const tcompareProductsAlternate = compareProducts.map((p: any) => {
          return {
            product: p,
            compare: true,
            composition: p.composition,
            first_image_url: p.imageSrc ? p.imageSrc.replace("https://d1dh0rr5xj2p49.cloudfront.net/products/", "") : "",
            product_id: p.product_id,
            product_name: p.name,
            product_pricing_new: p.ourPrice || p.averagePrice || 0,
            product_pricing_old: p.mrp || 0,
            salt_name: p.genericName,
            manufacturer: p.manufacturer || "Unknown Manufacturer",
            discountPercent: Math.round(
              (100 *
                (parseFloat(p.mrp || p.averagePrice || 0) - parseFloat(activeProduct.ourPrice || 0))) /
                parseFloat(p.mrp || 1)
            ),
            product_available: p.product_available ?? 1,
          };
        });
        setCompareToAlternateInfo(tcompareProductsAlternate);
      }
    };
    init();
  }, [rawProduct, compareProducts]);

  const fetchAlternateProducts = async (page = 1) => {
    if (!currentMedicineInfo?.composition) return;

    try {
      const result = await search_altProducts(page, {
        composition: currentMedicineInfo.composition,
        exclude_product_id: currentMedicineInfo.product_id,
        rc: 1,
        show_hidden: false,
      });

      if (!result?.results || result.results.length === 0) return;

      const filteredResults = result.results
        .filter((p: any) => p.product_id !== currentMedicineInfo.product_id)
        .filter((p: any) => !compareProducts.some((c: any) => c.product_id === p.product_id));

      const mappedResults = filteredResults.map((alternate: any) => {
        const currentPrice = parseFloat(
          currentMedicineInfo.ourPrice || currentMedicineInfo.averagePrice || 0
        );
        const altPrice = parseFloat(alternate.product_pricing_new || 0);

        const discountPercent =
          currentPrice > 0
            ? Math.round(((currentPrice - altPrice) / currentPrice) * 100)
            : 0;

        let first_image_url = "";
        try {
          if (alternate.images) {
            const parsedImages = JSON.parse(alternate.images);
            if (Array.isArray(parsedImages) && parsedImages.length > 0) {
              first_image_url = parsedImages[0].img;
            }
          }
        } catch (err) {
          console.error("Error parsing alternate images:", err);
        }

        return {
          ...alternate,
          first_image_url,
          manufacturer: alternate.manufacturer || "Unknown Manufacturer",
          discountPercent,
        };
      });

      if (mappedResults.length > 0) {
        setCompareToAlternateInfo((prev) =>
          page === 1 ? mappedResults : [...prev, ...mappedResults]
        );
      }

      setTotalPages(result.total_pages || 1);
    } catch (error) {
      console.error("Failed to fetch alternate products", error);
    }
  };

  useEffect(() => {
    if (currentMedicineInfo?.composition && rawProduct) {
      fetchAlternateProducts(currentPage);
    }
  }, [currentPage, currentMedicineInfo?.composition]);

  const removeFromCompare = (alternate: any, index: number) => {
    dispatchCompare({
      type: "REMOVE_FROM_COMPARE",
      payload: alternate,
    });
    const newCompareToAlternateInfo = [...compareToAlternateInfo];
    newCompareToAlternateInfo.splice(index, 1);
    setCompareToAlternateInfo(newCompareToAlternateInfo);
  };

  const handleViewMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const getProductImage = (item: any) => {
    if (!item) return "https://d1dh0rr5xj2p49.cloudfront.net/products/placeholder.png";
    if (item.imageSrc && item.imageSrc !== "undefined") return item.imageSrc;
    if (item.first_image_url) {
      if (item.first_image_url.startsWith("http")) return item.first_image_url;
      return `https://d1dh0rr5xj2p49.cloudfront.net/products/${item.first_image_url}`;
    }
    return "https://d1dh0rr5xj2p49.cloudfront.net/products/placeholder.png";
  };

  const avgMarketPrice = parseFloat(currentMedicineInfo.averagePrice || 125);
  const medingenPrice = parseFloat(currentMedicineInfo.ourPrice || 48);
  const savingsPercent = avgMarketPrice > 0 ? Math.round(((avgMarketPrice - medingenPrice) / avgMarketPrice) * 100) : 61;

  return (
    <>
      <div className={`compare-container-wrapper${embedded ? " compare-view-embedded" : ""}`}>
        {!embedded && <HeaderComponent title="Compare Products" />}

        <main className="compare-main-content">
          {/* Section Header */}
          <div className="compare-section-header">
            <h2 className="section-title">Products with Identical Composition</h2>
            <p className="section-subtitle">Same chemical composition, different brands and better prices</p>
          </div>

          {/* Products Cards Grid */}
          <div className="compare-cards-grid">
            {/* Selected Product Card */}
            <div className="compare-card selected-product-card" suppressHydrationWarning>
              <div className="selected-pill-tag">Selected Product</div>
              <div className="card-image-wrap">
                <img
                  src={getProductImage(currentMedicineInfo)}
                  alt={currentMedicineInfo.name || currentMedicineInfo.product_name}
                  className="card-product-img"
                  suppressHydrationWarning
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://d1dh0rr5xj2p49.cloudfront.net/products/placeholder.png";
                  }}
                />
              </div>
              <div className="card-info" suppressHydrationWarning>
                <h3 className="product-title" suppressHydrationWarning>{currentMedicineInfo.name || currentMedicineInfo.product_name || "Telma 40 Tablet"}</h3>
                <p className="manufacturer-name" suppressHydrationWarning>{currentMedicineInfo.manufacturer || "Glenmark Pharmaceuticals"}</p>

                <div className="spec-group">
                  <span className="spec-label">Generic Name</span>
                  <span className="spec-value">{currentMedicineInfo.genericName || currentMedicineInfo.salt_name || "Telmisartan"}</span>
                </div>

                <div className="spec-group">
                  <span className="spec-label">Composition</span>
                  <span className="spec-value">{currentMedicineInfo.composition || "Telmisartan 40 mg"}</span>
                </div>

                <div className="card-pricing-block">
                  {currentMedicineInfo.mrp > 0 && (
                    <div className="mrp-row">
                      <span className="price-label">MRP</span>
                      <span className="mrp-value">₹{parseFloat(currentMedicineInfo.mrp).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="our-price-row">
                    <span className="our-price-label">Our Price</span>
                    <span className="our-price-value">₹{parseFloat(currentMedicineInfo.ourPrice || currentMedicineInfo.product_pricing_new || 55).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alternate Product Cards */}
            {compareToAlternateInfo.map((alternate, index) => {
              const isOutOfStock = alternate.product_available === 0;
              const discountVal = alternate.discountPercent ?? 0;
              const isDiscount = discountVal >= 0;

              return (
                <div className="compare-card alt-product-card" key={alternate.product_id || index}>
                  {discountVal !== 0 && (
                    <div className={`discount-pill ${isDiscount ? "green-discount" : "red-discount"}`}>
                      {isDiscount ? `↓ ${discountVal}%` : `↑ ${Math.abs(discountVal)}%`}
                    </div>
                  )}

                  <div className="card-image-wrap">
                    <Link to={`/product/${alternate.product_name_url || alternate.product_id}`}>
                      <img
                        src={getProductImage(alternate)}
                        alt={alternate.product_name || alternate.name}
                        className="card-product-img"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://d1dh0rr5xj2p49.cloudfront.net/products/placeholder.png";
                        }}
                      />
                    </Link>
                  </div>

                  <div className="card-info">
                    <Link to={`/product/${alternate.product_name_url || alternate.product_id}`} className="product-title-link">
                      <h3 className="product-title">{alternate.product_name || alternate.name}</h3>
                    </Link>
                    <p className="manufacturer-name">{alternate.manufacturer || "Cipla"}</p>

                    <div className="spec-group">
                      <span className="spec-label">Generic Name</span>
                      <span className="spec-value">{alternate.salt_name || alternate.genericName || "Telmisartan"}</span>
                    </div>

                    <div className="spec-group">
                      <span className="spec-label">Composition</span>
                      <span className="spec-value">{alternate.composition || "Telmisartan 40 mg"}</span>
                    </div>

                    <div className="card-pricing-block">
                      {(alternate.product_pricing_old > 0 || alternate.mrp > 0) && (
                        <div className="mrp-row">
                          <span className="price-label">MRP</span>
                          <span className="mrp-value">₹{parseFloat(alternate.product_pricing_old || alternate.mrp || 0).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="our-price-row">
                        <span className="our-price-label">Our Price</span>
                        <span className="our-price-value">₹{parseFloat(alternate.product_pricing_new || alternate.ourPrice || 0).toFixed(2)}</span>
                      </div>
                    </div>

                    {isOutOfStock && (
                      <div className="stock-warning">
                        <span className="stock-red-dot"></span> Currently Out of Stock
                      </div>
                    )}

                    <div className="card-actions">
                      {!isOutOfStock ? (
                        <button
                          className="btn-add-cart"
                          onClick={() => handleCart(alternate)}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <circle cx="9" cy="21" r="1"/>
                            <circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                          </svg>
                          <span>+ Add to Cart</span>
                        </button>
                      ) : (
                        <button
                          className="btn-request-product"
                          onClick={() => handleRequest(alternate)}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                          </svg>
                          <span>Request Product</span>
                        </button>
                      )}

                      {alternate.compare && (
                        <button
                          className="btn-remove-compare"
                          onClick={() => removeFromCompare(alternate.product, index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View More Products Button */}
          {currentPage < totalPages && (
            <div className="view-more-container">
              <button className="btn-view-more" onClick={handleViewMore}>
                <span>View More Products</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>
            </div>
          )}

          {/* Bottom Price Comparison Bar */}
          {!embedded && (
            <div className="price-comparison-bar">
              <div className="pc-left-section">
                <div className="pc-icon-circle">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                </div>
                <div className="pc-header-titles">
                  <h3 className="pc-title">Price Comparison</h3>
                  <p className="pc-subtitle">Average market price vs. Medingen price for this composition</p>
                </div>
              </div>

              <div className="pc-middle-section">
                <div className="pc-price-col">
                  <span className="pc-col-label">Average Market Price</span>
                  <span className="pc-col-value">₹{avgMarketPrice.toFixed(2)}</span>
                  <div className="pc-progress-bg">
                    <div className="pc-progress-fill gray-fill" style={{ width: "85%" }}></div>
                  </div>
                </div>

                <div className="pc-price-col">
                  <span className="pc-col-label">Medingen Price</span>
                  <span className="pc-col-value">₹{medingenPrice.toFixed(2)}</span>
                  <div className="pc-progress-bg">
                    <div className="pc-progress-fill green-fill" style={{ width: `${Math.min(100, Math.max(25, (medingenPrice / avgMarketPrice) * 100))}%` }}></div>
                  </div>
                </div>

                <div className="pc-savings-card">
                  <span className="save-label">You Save</span>
                  <span className="save-big-percent">{savingsPercent > 0 ? savingsPercent : 61}%</span>
                  <span className="save-caption">compared to market price</span>
                </div>
              </div>

              <div className="pc-right-actions">
                {currentMedicineInfo.product_available > 0 && (
                  <button className="pc-btn-cart" onClick={() => handleCart(currentMedicineInfo)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <circle cx="9" cy="21" r="1"/>
                      <circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    <span>+ Add to Cart</span>
                  </button>
                )}
                <button className="pc-btn-back" onClick={handleBack}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                  <span>Back</span>
                </button>
              </div>
            </div>
          )}
        </main>

        {!embedded && <Navigation />}
      </div>
    </>
  );
};

