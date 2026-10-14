// Analytics tracking helper for Google Tag Manager (GTM)
// Pushes events to window.dataLayer for GA4/Meta Pixel/Google Ads mapping

const parsePrice = (priceVal) => {
  if (typeof priceVal === "number") return priceVal;
  if (typeof priceVal === "string") {
    const cleaned = priceVal.replace(/[^0-9.]/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const pushToDataLayer = (event, data) => {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event,
      ...data
    });
  }
};

/**
 * Tracks product views (view_item)
 * @param {object} product - The product details object
 */
export const trackViewItem = (product) => {
  if (!product) return;
  const price = parsePrice(product.price || product.ourPrice);
  pushToDataLayer("view_item", {
    ecommerce: {
      currency: "INR",
      value: price,
      items: [{
        item_id: product.id || product.product_id,
        item_name: product.name || product.productName,
        item_brand: product.brand || product.manufacturer || "",
        item_category: product.category || product.selectedCategory || "",
        price: price,
        quantity: 1
      }]
    }
  });
};

/**
 * Tracks search suggestion click (search)
 * @param {string} searchTerm - The name of the clicked medicine suggestion
 */
export const trackSearch = (searchTerm) => {
  if (!searchTerm) return;
  pushToDataLayer("search", {
    search_term: searchTerm
  });
};

/**
 * Tracks adding a product to cart (add_to_cart)
 * @param {object} product - The product details object
 * @param {number} quantity - Quantity of the item added
 */
export const trackAddToCart = (product, quantity) => {
  if (!product) return;
  const price = parsePrice(product.price || product.ourPrice || product.discountedPrice);
  pushToDataLayer("add_to_cart", {
    ecommerce: {
      currency: "INR",
      value: price * quantity,
      items: [{
        item_id: product.id || product.product_id,
        item_name: product.name || product.productName,
        item_brand: product.brand || product.manufacturer || "",
        item_category: product.category || product.selectedCategory || "",
        price: price,
        quantity: quantity
      }]
    }
  });
};

/**
 * Tracks removing a product from cart (remove_from_cart)
 * @param {object} product - The product details object
 * @param {number} quantity - Updated quantity of the item in cart
 */
export const trackRemoveFromCart = (product, quantity) => {
  if (!product) return;
  const price = parsePrice(product.price || product.ourPrice || product.discountedPrice);
  pushToDataLayer("remove_from_cart", {
    ecommerce: {
      currency: "INR",
      value: price * quantity,
      items: [{
        item_id: product.id || product.product_id,
        item_name: product.name || product.productName,
        item_brand: product.brand || product.manufacturer || "",
        item_category: product.category || product.selectedCategory || "",
        price: price,
        quantity: quantity
      }]
    }
  });
};

/**
 * Tracks beginning checkout (begin_checkout)
 * @param {number} cartTotal - Total payable amount
 * @param {array} items - Cart items
 */
export const trackBeginCheckout = (cartTotal, items) => {
  const value = parsePrice(cartTotal);
  pushToDataLayer("begin_checkout", {
    ecommerce: {
      currency: "INR",
      value: value,
      items: (items || []).map(item => ({
        item_id: item.id || item.product_id,
        item_name: item.name || item.productName || item.product_name,
        item_brand: item.brand || item.manufacturer || "",
        item_category: item.category || item.selectedCategory || "",
        price: parsePrice(item.price || item.discountedPrice || item.ourPrice),
        quantity: item.quantity
      }))
    }
  });
};

/**
 * Tracks a purchase success (purchase)
 * @param {object} purchaseData - Object containing purchase details
 */
export const trackPurchase = (purchaseData) => {
  if (!purchaseData) return;
  pushToDataLayer("purchase", {
    ecommerce: {
      transaction_id: purchaseData.transaction_id,
      affiliation: "Medingen",
      value: parsePrice(purchaseData.value),
      tax: parsePrice(purchaseData.tax || 0),
      shipping: parsePrice(purchaseData.shipping || 0),
      currency: "INR",
      coupon: purchaseData.coupon || "",
      items: (purchaseData.items || []).map(item => ({
        item_id: item.item_id || item.id || item.product_id,
        item_name: item.item_name || item.name || item.productName || item.product_name,
        item_brand: item.item_brand || item.brand || item.manufacturer || "",
        item_category: item.item_category || item.category || item.selectedCategory || "",
        price: parsePrice(item.price || item.discountedPrice || item.ourPrice),
        quantity: item.quantity
      }))
    }
  });
};
