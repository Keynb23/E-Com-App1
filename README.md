-------------------------------------------------E-commerce Application-----------------------------------------------------------------|
This project is a modern e-commerce front-end. It's built with React, Redux Toolkit, React Router, Firebase, and React Query. 
The app lets users browse products, manage a shopping cart, handle accounts, and (for admins) manage products.
----------------------------------------------------------------------------------------------------------------------------------------|
How the Code Works
This app handles everything from showing products to managing user accounts and carts. Here's a quick breakdown:
----------------------------------------------------------------------------------------------------------------------------------------|
1. Core Technologies
React: Builds the user interface with interactive components.
        Redux Toolkit: Manages app-wide data (ex: Cart.tsx) predictably.
        React Router: Manages page navigation (Home, Cart, Profile) without full reloads.
        Firebase: Used for:
            Authentication: Handles user sign-up, login, and logout.
            Firestore (Database/db): Stores product data and order history.
        React Query: Fetches, caches, and updates data from Firebase or other APIs, managing loading and errors.
        Axios: Makes HTTP requests to external APIs (like the Fake Store API).
----------------------------------------------------------------------------------------------------------------------------------------|
2. Application Structure
The code's organized into clear folders:

src/components: Reusable UI parts (ex: ProductCard, Navbar).
        src/pages: Main app views (ex: Home, Cart, Profile).
        src/context: Provides global data (AuthContext for user status, ProductContext for product lists).
        src/store: Redux setup, defining how the cart works (cartSlice) and the main data store.
        src/lib/firebase: Initializes the Firebase connection.
        src/types: Defines data structures (ex: Product, CartItem) for type safety.
        .github/workflows: Contains GitHub Actions for automated builds and deployments.
----------------------------------------------------------------------------------------------------------------------------------------|
3. Key Features
#### A. Products & Categories
        (Files: Home.tsx, ProductCard.tsx, ProductContext.tsx)

Fetching Data: The Home page uses React Query to get products and categories from Firebase Firestore.
        Displaying Products: Each product is shown with a ProductCard, detailing its title, price, rating, etc.
        Filtering: You can filter products by category. ProductContext manages this list.

#### B. Shopping Cart
        (Files: Cart.tsx, cartSlice.ts, CartButtons.tsx)

Redux for Cart: Your cart's contents (items, totals) are managed by Redux Toolkit's cartSlice, making it accessible app-wide.
        Adding/Removing Items:
            The AddToCart button adds a product to Redux. If it's already there, quantity increases.
            In the cart, you can increase/decrease item quantities or remove items completely.
        Checkout: The Cart component sends your order details (items, total) to Firebase Firestore and then clears your cart.

#### C. User Authentication
        (Files: Register.tsx, Login.tsx, Logout.tsx, Profile.tsx, AuthContext.tsx)

Firebase Authentication: Handles all user sign-up, login, and logout.
        AuthContext: Provides logged-in user info (user) to components.
        Profile Management: The Profile page lets users update their name or delete their account via Firebase.
        Order History: The Profile page also shows past orders fetched from Firebase Firestore.

#### D. Product Management (CRUD)
        (File: CRUD.tsx)

This page lets authenticated users Create, Read, Update, and Delete products in Firebase Firestore. This is typically for administrators.
----------------------------------------------------------------------------------------------------------------------------------------|
4. Continuous Integration & Deployment
(File: .github/workflows/main.yml)

We use GitHub Actions to automate our workflow:

Build Job: Automatically checks out code, installs dependencies, and builds the React app on every push or pull request. This ensures code always compiles.
        Deploy Job: After a successful build, the app automatically deploys to Vercel. This speeds up getting new features and fixes to users.