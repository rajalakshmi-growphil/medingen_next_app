# Medingen Route Migration Document

This document maps the 55 original routes from the React SPA (`medingen_app_old`) to the Next.js App Router architecture (`medingen_app_next`).

| # | Old Route | Next.js App Router Route | Feature / Component | Rendering Type | Status |
|---|---|---|---|---|---|
| 1 | `/` | `app/page.tsx` | `features/home/Dashboard` | Dynamic Server Page | Done |
| 2 | `/about` | `app/about/page.tsx` | `features/home/Dashboard` | Dynamic Server Page | Done |
| 3 | `/help-center` | `app/help-center/page.tsx` | `features/home/Dashboard` | Dynamic Server Page | Done |
| 4 | `/generic-medicine-online` | `app/generic-medicine-online/page.tsx` | `features/products/GenericMedicineOnline` | Dynamic Server Page | Done |
| 5 | `/categories` | `app/categories/page.tsx` | `features/categories/Category/AllCategories` | Dynamic Server Page | Done |
| 6 | `/categories/:mainCategory` | `app/categories/[mainCategory]/page.tsx` | `features/categories/Category/MainCategory` | Dynamic Server Page | Done |
| 7 | `/categories/:mainCategory/:subCategory` | `app/categories/[mainCategory]/[subCategory]/page.tsx` | `features/categories/Category/SubCategory` | Dynamic Server Page | Done |
| 8 | `/category` | `app/category/page.tsx` | `features/categories/Category/AllCategories` | Dynamic Server Page | Done |
| 9 | `/product` | `app/product/page.tsx` | `features/products/SearchViewMedicine` | Dynamic Server Page | Done |
| 10 | `/product/*` | `app/product/[...slug]/page.tsx` | `features/products/SearchViewMedicine` | Server Component + SEO Metadata | Done |
| 11 | `/product_name/:name` | `app/product/[...slug]/page.tsx` | Redirect (301) to `/product/[...slug]` | Server Redirect | Done |
| 12 | `/productid/:productId` | `app/productid/[productId]/page.tsx` | `features/products/SearchViewMedicine` | Dynamic Server Page | Done |
| 13 | `/salt/*` | `app/salt/[...slug]/page.tsx` | `features/products/SaltPage` | Dynamic Server Page | Done |
| 14 | `/blogs` | `app/blogs/page.tsx` | `features/blogs/Blogs` | Dynamic Server Page | Done |
| 15 | `/blogs/:blogUrl` | `app/blogs/[blogUrl]/page.tsx` | `features/blogs/Blog` | Dynamic Server Page | Done |
| 16 | `/blog/vitamin-k-rich-foods` | `app/blogs/[blogUrl]/page.tsx` | Redirect (301) to `/blogs/vitamin-k-rich-foods` | Server Redirect | Done |
| 17 | `/searchbox` | `app/searchbox/page.tsx` | `features/search/SearchBox` | Dynamic Server Page | Done |
| 18 | `/search-results` | `app/search-results/page.tsx` | `features/search/SearchResults` | Dynamic Server Page | Done |
| 19 | `/offers` | `app/offers/page.tsx` | `features/offers/Offers` | Dynamic Server Page | Done |
| 20 | `/view-offer` | `app/view-offer/page.tsx` | `features/offers/OffersView` | Dynamic Server Page | Done |
| 21 | `/compare` | `app/compare/page.tsx` | `features/products/CompareView` | Dynamic Server Page | Done |
| 22 | `/login` | `app/login/page.tsx` | `features/auth/Login1` | Client Component | Done |
| 23 | `/login2` | `app/login2/page.tsx` | `features/auth/Login2` | Client Component | Done |
| 24 | `/login3` | `app/login3/page.tsx` | `features/auth/Login3` | Client Component | Done |
| 25 | `/existing` | `app/existing/page.tsx` | `features/auth/ExistingUser` | Client Component | Done |
| 26 | `/enterpassword` | `app/enterpassword/page.tsx` | `features/auth/EnterPassword` | Client Component | Done |
| 27 | `/createpassword` | `app/createpassword/page.tsx` | `features/auth/CreatePassword` | Client Component | Done |
| 28 | `/create-profile` | `app/create-profile/page.tsx` | `features/auth/CreateProfile` | Client Component | Done |
| 29 | `/splash` | `app/splash/page.tsx` | `features/auth/Splash1` | Client Component | Done |
| 30 | `/cart` | `app/cart/page.tsx` | `features/cart/LandingPage` | Client Component | Done |
| 31 | `/cart/pharmacist-verification` | `app/cart/pharmacist-verification/page.tsx` | `features/cart/PharmacistVerification` | Client Component | Done |
| 32 | `/cart/pharmacist-verification/payment` | `app/cart/pharmacist-verification/payment/page.tsx` | `features/cart/PaymentPage` | Client Component | Done |
| 33 | `/cart/pharmacist-verification/payment/place-order` | `app/cart/pharmacist-verification/payment/place-order/page.tsx` | `features/cart/OrderConfirmed` | Client Component | Done |
| 34 | `/orders` | `app/orders/page.tsx` | `features/orders/Orders` | Client Component | Done |
| 35 | `/order/*` | `app/order/[...path]/page.tsx` | `features/orders/OrdersTrack` | Client Component | Done |
| 36 | `/order-details/:id` | `app/order-details/[id]/page.tsx` | `features/orders/OrderDetails` | Client Component | Done |
| 37 | `/invoice/:id` | `app/invoice/[id]/page.tsx` | `features/orders/OrderDetails` | Client Component | Done |
| 38 | `/profile` | `app/profile/page.tsx` | `features/profile/ProfileView` | Client Component | Done |
| 39 | `/personal-info` | `app/personal-info/page.tsx` | `features/profile/PersonalInfo` | Client Component | Done |
| 40 | `/change-password` | `app/change-password/page.tsx` | `features/profile/ChangePassword` | Client Component | Done |
| 41 | `/savedaddress` | `app/savedaddress/page.tsx` | `features/profile/SavedAddress` | Client Component | Done |
| 42 | `/addressnew` | `app/addressnew/page.tsx` | `features/profile/AddressNew` | Client Component | Done |
| 43 | `/reminder` | `app/reminder/page.tsx` | `features/reminders/Reminder` | Client Component | Done |
| 44 | `/notification` | `app/notification/page.tsx` | `features/notifications/Notifications` | Client Component | Done |
| 45 | `/rewards` | `app/rewards/page.tsx` | `features/offers/Rewards` | Client Component | Done |
| 46 | `/upload-prescription` | `app/upload-prescription/page.tsx` | `features/checkout/UploadPrescription` | Client Component | Done |
| 47 | `/select-prescription` | `app/select-prescription/page.tsx` | `features/checkout/SelectPrescription` | Client Component | Done |
| 48 | `/capture-prescription` | `app/capture-prescription/page.tsx` | `features/checkout/CapturePrescription` | Client Component | Done |
| 49 | `/order-payment` | `app/order-payment/page.tsx` | `features/orders/OrderPayment` | Client Component | Done |
| 50 | `/order-progress` | `app/order-progress/page.tsx` | `features/orders/OrderProgressConfirmation` | Client Component | Done |
| 51 | `/policies-terms-and-conditions` | `app/policies-terms-and-conditions/page.tsx` | `features/home/PolicyPages` | Dynamic Server Page | Done |
| 52 | `/policies-privacy-policy` | `app/policies-privacy-policy/page.tsx` | `features/home/PrivacyPolicy` | Dynamic Server Page | Done |
| 53 | `/policies-return-policy` | `app/policies-return-policy/page.tsx` | `features/home/PolicyPages` | Dynamic Server Page | Done |
| 54 | `/policies-grievance-redressal-policy` | `app/policies-grievance-redressal-policy/page.tsx` | `features/home/PolicyPages` | Dynamic Server Page | Done |
| 55 | `/admin/*` | `app/admin/[...path]/page.tsx` | Admin Component | Client Component | Done |
