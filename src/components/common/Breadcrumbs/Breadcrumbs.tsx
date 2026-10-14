"use client";
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Breadcrumbs.css';

const routeNameMap = {
    'product': 'Product',
    'categories': 'Categories',
    'category': 'Categories',
    'salt': 'Salts & Ingredients',
    'savedaddress': 'Address',
    'addressnew': 'Add New Address',
    'upload-prescription': 'Upload Prescription',
    'select-prescription': 'Select Prescription',
    'order-placed-success': 'Order Success',
    'order-confirmed': 'Order Confirmed',
    'login': 'Login',
    'login2': 'Login Step 2',
    'login3': 'Login Step 3',
    'create-profile': 'Create Profile',
    'enterpassword': 'Enter Password',
    'change-password': 'Change Password',
    'existing': 'Existing User',
    'searchbox': 'Search',
    'search-results': 'Search Results',
    'compare': 'Compare Products',
    'offers': 'Offers',
    'rewards': 'Rewards',
    'view-offer': 'Offer Details',
    'cart': 'Cart',
    'order-progress': 'Order Progress',
    'order-payment': 'Payment',
    'orders': 'My Orders',
    'notification': 'Notifications',
    'profile': 'Account',
    'createpassword': 'Create Password',
    'capture-prescription': 'Capture Prescription',
    'help-center': 'Help Center',
    'privacy-policy': 'Privacy Policy',
    'terms-and-conditions': 'Terms & Conditions',
    'grievance-redressal-policy': 'Grievance Redressal',
    'return-policy': 'Return Policy',
    'blogs': 'Blogs',
    'order-details': 'Order Details',
    'order': 'Order Track'
};

const routeHierarchy = {
    'savedaddress': ['profile'],
    'addressnew': ['profile', 'savedaddress'],
    'orders': ['profile'],
    'change-password': ['profile'],
    'notification': ['profile'],
    'rewards': ['profile'],
    'order-details': ['profile', 'orders'],
    'order': ['profile', 'orders']
};

const cleanCompositionName = (rawName) => {
    if (!rawName) return "";
    return rawName
        .replace(/\b\d+(\.\d+)?\s*%?\s*(w\/v|w\/w|v\/v|w\s*v|w\s*w|v\s*v)\b/gi, "")
        .replace(/\b\d+(\.\d+)?\s*%/gi, "")
        .replace(/\b(w\/v|w\/w|v\/v)\b/gi, "")
        .replace(/\b\d+(\.\d+)?\s*(mg|mcg|gm|g|ml)\b/gi, "")
        .replace(/\s*\+\s*/g, " + ")
        .replace(/\s+/g, " ")
        .trim();
};

const nameToSlug = (name) => {
    if (!name) return "";
    const cleaned = cleanCompositionName(name);
    const target = cleaned || name;
    return target
        .toString()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/\+/g, " ")
        .replace(/\//g, "-")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
};

const titleCase = (str) => {
    if (!str) return "";
    const cleanStr = str.toString().replace(/^\/+/, '');
    return cleanStr
        .toLowerCase()
        .split(/[- ]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

let hasClientHydrated = false;

const Breadcrumbs = ({ className = "", customTrail = null }: { className?: string; customTrail?: Array<{ name: string; path?: string; url?: string }> | null }) => {
    if (customTrail && customTrail.length > 0) {
        return (
            <nav className={`breadcrumbs-container ${className}`} aria-label="breadcrumb" suppressHydrationWarning>
                <ul className="breadcrumbs-list" suppressHydrationWarning>
                    {customTrail.map((crumb, index) => {
                        const isLast = index === customTrail.length - 1;
                        const cleanName = (crumb.name || '').replace(/^[\/\s]+/, '').trim();
                        const rawPath = crumb.path || crumb.url || '/';
                        const cleanPath = rawPath.startsWith('https://medingen.in')
                            ? rawPath.replace('https://medingen.in', '')
                            : rawPath;

                        return (
                            <li key={(crumb.path || crumb.url || '') + index} className={`breadcrumb-item ${isLast ? 'active' : ''}`}>
                                {isLast ? (
                                    <span className="breadcrumb-current">{cleanName}</span>
                                ) : (
                                    <Link to={cleanPath || '/'} className="breadcrumb-link">{cleanName}</Link>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>
        );
    }

    const [isMounted, setIsMounted] = React.useState(hasClientHydrated);

    React.useEffect(() => {
        hasClientHydrated = true;
        setIsMounted(true);
    }, []);

    const isClient = isMounted || hasClientHydrated;
    const location = useLocation();

    const pathnames = location.pathname.split('/').filter((x) => x);

    if (pathnames.length === 0) {
        return null;
    }

    const isProductPage = pathnames[0] === 'product' && pathnames.length > 1;

    if (isProductPage) {
        const productSlug = pathnames[1];
        const state = (isClient ? location.state : null) || {};
        const searchParams = new URLSearchParams(isClient ? location.search : '');

        const win = isClient && typeof window !== 'undefined' ? (window as any) : null;
        const catName = isClient ? (state.categoryName || state.category || state.product?.selectedCategory || state.product?.categories || win?.__CURRENT_PRODUCT_CATEGORY__) : null;
        const mainCat = isClient ? (state.mainCategory || state.product?.mainCategory || win?.__CURRENT_PRODUCT_MAIN_CATEGORY__) : null;
        const subCat = isClient ? (state.subCategory || state.product?.subCategory || win?.__CURRENT_PRODUCT_SUB_CATEGORY__) : null;
        const searchQ = isClient ? (state.searchQuery || searchParams.get('q')) : null;
        const from = isClient ? state.from : null;

        let dynamicTrail = [];

        if (from === 'category' || (catName && from !== 'search' && from !== 'offers' && from !== 'salt') || mainCat || subCat) {
            dynamicTrail.push({
                path: '/categories',
                name: 'Categories'
            });

            if (mainCat && subCat) {
                dynamicTrail.push({
                    path: `/categories/${nameToSlug(mainCat)}`,
                    name: titleCase(mainCat)
                });
                dynamicTrail.push({
                    path: `/categories/${nameToSlug(mainCat)}/${nameToSlug(subCat)}`,
                    name: titleCase(subCat)
                });
            } else if (mainCat) {
                dynamicTrail.push({
                    path: `/categories/${nameToSlug(mainCat)}`,
                    name: titleCase(mainCat)
                });
                if (subCat) {
                    dynamicTrail.push({
                        path: `/categories/${nameToSlug(mainCat)}/${nameToSlug(subCat)}`,
                        name: titleCase(subCat)
                    });
                } else if (catName && catName.toLowerCase().trim() !== mainCat.toLowerCase().trim()) {
                    dynamicTrail.push({
                        path: `/categories/${nameToSlug(mainCat)}/${nameToSlug(catName)}`,
                        name: titleCase(catName)
                    });
                }
            } else if (subCat) {
                dynamicTrail.push({
                    path: `/categories/${nameToSlug(subCat)}`,
                    name: titleCase(subCat)
                });
            } else if (catName) {
                dynamicTrail.push({
                    path: `/category?name=${encodeURIComponent(catName)}`,
                    name: titleCase(catName)
                });
            }
        } else if (from === 'search') {
            const searchPath = searchQ ? `/search-results?q=${encodeURIComponent(searchQ)}` : '/search-results';
            const searchName = searchQ ? `Search (${titleCase(searchQ)})` : 'Search Results';
            dynamicTrail.push({
                path: searchPath,
                name: searchName
            });
        } else if (from === 'offers') {
            dynamicTrail.push({
                path: '/offers',
                name: 'Offers & Discounts'
            });
        } else if (from === 'salt' || (isClient && state.saltName)) {
            dynamicTrail.push({
                path: '/salt',
                name: 'Salts & Ingredients'
            });
            if (state.saltName) {
                const sSlug = state.saltSlug || nameToSlug(state.saltName);
                dynamicTrail.push({
                    path: `/salt/${sSlug}`,
                    name: titleCase(state.saltName)
                });
            }
        } else if (catName) {
            dynamicTrail.push({
                path: `/categories/${nameToSlug(catName)}`,
                name: titleCase(catName)
            });
        } else {
            dynamicTrail.push({
                path: '/product',
                name: 'Product'
            });
        }

        const productDisplayName = (isClient && (state.product?.name || state.product?.productName))
            ? (state.product?.name || state.product?.productName)
            : titleCase(decodeURIComponent(productSlug).replace(/-/g, ' '));

        dynamicTrail.push({
            path: location.pathname,
            name: productDisplayName
        });

        return (
            <nav className="breadcrumbs-container" aria-label="breadcrumb" suppressHydrationWarning>
                <ul className="breadcrumbs-list" suppressHydrationWarning>
                    <li className="breadcrumb-item">
                        <Link to="/" className="breadcrumb-link">Home</Link>
                    </li>
                    {dynamicTrail.map((crumb, index) => {
                        const isLast = index === dynamicTrail.length - 1;
                        const cleanName = (crumb.name || '').replace(/^[\/\s]+/, '').trim();

                        return (
                            <li key={crumb.path + index} className={`breadcrumb-item ${isLast ? 'active' : ''}`}>
                                {isLast ? (
                                    <span className="breadcrumb-current">{cleanName}</span>
                                ) : (
                                    <Link to={crumb.path} className="breadcrumb-link">{cleanName}</Link>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>
        );
    }

    const isSaltPage = (pathnames[0] === 'salt' || pathnames[0] === 'salt_name') && pathnames.length > 1;

    if (isSaltPage) {
        const saltSlug = pathnames.slice(1).join('/');
        const rawSaltName = decodeURIComponent(saltSlug).replace(/-/g, ' ');
        const state = (isClient ? location.state : null) || {};
        const searchParams = new URLSearchParams(isClient ? location.search : '');

        const saltDisplayName = (isClient && state.saltDisplayName)
            ? state.saltDisplayName
            : titleCase(cleanCompositionName(rawSaltName) || rawSaltName);
        const catName = isClient ? (state.categoryName || state.category) : null;
        const mainCat = isClient ? state.mainCategory : null;
        const subCat = isClient ? state.subCategory : null;
        const searchQ = isClient ? (state.searchQuery || searchParams.get('q')) : null;
        const from = isClient ? state.from : null;

        let dynamicTrail = [];

        if (from === 'product' || (isClient && state.productName)) {
            if (mainCat || catName) {
                dynamicTrail.push({ path: '/categories', name: 'Categories' });
                if (mainCat) {
                    dynamicTrail.push({ path: `/categories/${nameToSlug(mainCat)}`, name: titleCase(mainCat) });
                    if (subCat) {
                        dynamicTrail.push({ path: `/categories/${nameToSlug(mainCat)}/${nameToSlug(subCat)}`, name: titleCase(subCat) });
                    }
                } else if (catName) {
                    dynamicTrail.push({ path: `/category?name=${encodeURIComponent(catName)}`, name: titleCase(catName) });
                }
            }
            if (state.productName && state.productSlug) {
                dynamicTrail.push({
                    path: `/product/${state.productSlug}`,
                    name: titleCase(state.productName)
                });
            } else if (state.productName) {
                dynamicTrail.push({
                    path: `/product/${nameToSlug(state.productName)}`,
                    name: titleCase(state.productName)
                });
            }
        } else if (from === 'category' || catName || mainCat) {
            dynamicTrail.push({ path: '/categories', name: 'Categories' });
            if (mainCat) {
                dynamicTrail.push({ path: `/categories/${nameToSlug(mainCat)}`, name: titleCase(mainCat) });
                if (subCat) {
                    dynamicTrail.push({ path: `/categories/${nameToSlug(mainCat)}/${nameToSlug(subCat)}`, name: titleCase(subCat) });
                }
            } else if (catName) {
                dynamicTrail.push({ path: `/category?name=${encodeURIComponent(catName)}`, name: titleCase(catName) });
            }
        } else if (from === 'search' || searchQ) {
            const q = searchQ || '';
            dynamicTrail.push({
                path: q ? `/search-results?q=${encodeURIComponent(q)}` : '/search-results',
                name: q ? `Search (${titleCase(q)})` : 'Search Results'
            });
        } else if (from === 'offers') {
            dynamicTrail.push({ path: '/offers', name: 'Offers & Discounts' });
        } else {
            dynamicTrail.push({ path: '/salt', name: 'Salts & Ingredients' });
        }

        dynamicTrail.push({
            path: location.pathname,
            name: saltDisplayName
        });

        return (
            <nav className="breadcrumbs-container" aria-label="breadcrumb" suppressHydrationWarning>
                <ul className="breadcrumbs-list" suppressHydrationWarning>
                    <li className="breadcrumb-item">
                        <Link to="/" className="breadcrumb-link">Home</Link>
                    </li>
                    {dynamicTrail.map((crumb, index) => {
                        const isLast = index === dynamicTrail.length - 1;
                        const cleanName = (crumb.name || '').replace(/^[\/\s]+/, '').trim();

                        return (
                            <li key={crumb.path + index} className={`breadcrumb-item ${isLast ? 'active' : ''}`}>
                                {isLast ? (
                                    <span className="breadcrumb-current">{cleanName}</span>
                                ) : (
                                    <Link to={crumb.path} className="breadcrumb-link">{cleanName}</Link>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>
        );
    }

    // 1. Check for hierarchy based on any segment in the path, but prioritize the last named segment
    const namedSegments = pathnames.filter(s => isNaN(Number(s)) || routeNameMap[s.toLowerCase()]);
    const mainSegment = namedSegments[namedSegments.length - 1]?.toLowerCase();
    let breadcrumbTrail = [];

    const searchParams = new URLSearchParams(isClient ? location.search : '');
    const categoryName = searchParams.get("name");

    if (isClient && location.state && location.state.parent) {
        const parentKey = location.state.parent.toString().replace(/^\/+/, '');
        const decodedParent = decodeURIComponent(parentKey);
        const parentName = (routeNameMap[decodedParent.toLowerCase()] || titleCase(decodedParent) || '').replace(/^\/+/, '');
        breadcrumbTrail.push({
            path: `/${parentKey}`,
            name: parentName
        });
    } else if (mainSegment && routeHierarchy[mainSegment]) {
        routeHierarchy[mainSegment].forEach(parentKey => {
            const cleanParentKey = parentKey.toString().replace(/^\/+/, '');
            const decodedParent = decodeURIComponent(cleanParentKey);
            const parentName = (routeNameMap[decodedParent.toLowerCase()] || titleCase(decodedParent) || '').replace(/^\/+/, '');
            breadcrumbTrail.push({
                path: `/${cleanParentKey}`,
                name: parentName
            });
        });
    }

    // 2. Build current trail from named segments only
    const currentTrail = namedSegments.map((value, index) => {
        const to = `/${pathnames.slice(0, pathnames.indexOf(value) + 1).join('/')}`;
        const cleanVal = value.replace(/^\/+/, '');
        const decoded = decodeURIComponent(cleanVal);
        let displayName = routeNameMap[decoded.toLowerCase()] || routeNameMap[cleanVal.toLowerCase()];

        if (!displayName) {
            displayName = titleCase(decoded);
        } else {
            displayName = displayName.replace(/^\/+/, '');
        }

        return {
            path: to,
            name: displayName
        };
    });

    if (location.pathname === '/category' && categoryName) {
        currentTrail.push({
            path: location.pathname + `?name=${encodeURIComponent(categoryName)}`,
            name: decodeURIComponent(categoryName)
        });

        const subCategoryName = searchParams.get("sub");
        if (subCategoryName) {
            const subs = subCategoryName.split(",");
            subs.forEach(sub => {
                currentTrail.push({
                    path: location.pathname + `?name=${encodeURIComponent(categoryName)}&sub=${encodeURIComponent(sub)}`,
                    name: decodeURIComponent(sub)
                });
            });
        }
    }

    const finalTrail = [...breadcrumbTrail, ...currentTrail];


    return (
        <nav className="breadcrumbs-container" aria-label="breadcrumb" suppressHydrationWarning>
            <ul className="breadcrumbs-list" suppressHydrationWarning>
                <li className="breadcrumb-item">
                    <Link to="/" className="breadcrumb-link">Home</Link>
                </li>
                {finalTrail.map((crumb, index) => {
                    const isLast = index === finalTrail.length - 1;
                    const cleanName = (crumb.name || '').replace(/^[\/\s]+/, '').trim();

                    return (
                        <li key={crumb.path + index} className={`breadcrumb-item ${isLast ? 'active' : ''}`}>
                            {isLast || cleanName === "Pharmacist Verification" ? (
                                <span className="breadcrumb-current">{cleanName}</span>
                            ) : (
                                <Link to={crumb.path} className="breadcrumb-link">{cleanName}</Link>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Breadcrumbs;

