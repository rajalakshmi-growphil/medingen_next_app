"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getOrders } from '@/api/Api';
import Invoice from '@/features/orders/OrderDetails/Invoice';

export default function InvoicePage() {
  const params = useParams();
  const id = params?.id;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        const data = await getOrders(1, id);
        if (data && data.orders) {
          const rawOrder = data.orders.find((o) => String(o.cart_id) === String(id));
          if (rawOrder) {
            const getNumericPrice = (priceStr) => {
              if (priceStr === null || priceStr === undefined) return 0.0;
              if (typeof priceStr === 'number') return priceStr;
              const strPrice = String(priceStr);
              const match = strPrice.match(/([\d,.]+)\s*$/);
              return match && match[1] ? parseFloat(match[1].replace(/,/g, '')) || 0.0 : 0.0;
            };

            const rawProducts = rawOrder.products || rawOrder.cart || [];
            const productMap = new Map();
            rawProducts.forEach((item) => {
              const pid = item.id || item.product_id;
              const unitPrice = getNumericPrice(item.discountedPrice || item.originalPrice || '0');
              const qty = Number(item.quantity || 1);
              if (productMap.has(pid)) {
                const existing = productMap.get(pid);
                existing.quantity += qty;
                existing.total_price += unitPrice * qty;
              } else {
                productMap.set(pid, {
                  name: item.name,
                  salt: item.salt || 'N/A',
                  quantity: qty,
                  price_per_unit: unitPrice,
                  total_price: unitPrice * qty,
                });
              }
            });

            const products = Array.from(productMap.values());
            const addr = rawOrder.deliveryAddress || {};
            const apiSummary = rawOrder.orderSummary || {};

            const shippingCharge = Number(apiSummary.total_shipping_charge || apiSummary.shipping_charge || rawOrder.shipping_charge || 0);
            const codCharge = Number(apiSummary.cod_charge || 0);
            const mrpTotal = getNumericPrice(apiSummary.totalMRP) || products.reduce((s, i) => s + i.total_price, 0);
            const sellingPrice = getNumericPrice(apiSummary.total_selling_price) || products.reduce((s, i) => s + i.total_price, 0);
            const totalAmount = Number(apiSummary.totalAmount || (sellingPrice + shippingCharge + codCharge));
            const savings = getNumericPrice(apiSummary.totalSavings) || (mrpTotal - sellingPrice);

            setOrder({
              order_id: rawOrder.cart_id,
              custom_order_id: rawOrder.order_id || ('#MIG-' + rawOrder.cart_id),
              items: products,
              address: {
                name: addr.fullName || addr.name || 'User',
                line1: addr.addressLine1 || '',
                line2: addr.addressLine2 || '',
                state: addr.state || '',
                pincode: addr.pincode || '',
                phone: addr.phone_number || addr.phoneNumber || addr.phone || '',
              },
              orderSummary: {
                totalAmount: totalAmount,
                totalMRP: mrpTotal,
                totalSavings: savings,
                total_selling_price: sellingPrice,
                total_shipping_charge: shippingCharge,
                total_cod_charge: codCharge,
              },
              payment_done_date: rawOrder.payment_done_date || rawOrder.cart_created_date,
            });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div style={{ padding: '100px', textAlign: 'center', fontSize: '20px', fontFamily: 'Outfit, sans-serif' }}>Generating Invoice...</div>;
  if (!order) return <div style={{ padding: '100px', textAlign: 'center', fontSize: '20px', fontFamily: 'Outfit, sans-serif' }}>Invoice not found.</div>;

  return <Invoice order={order} />;
}
