# Tasks

## Backend

### BE-01 Setup Backend

Acceptance Criteria

* Express running
* SQLite connected
* Prisma configured
* TypeScript configured

---

### BE-02 Category CRUD API

Acceptance Criteria

* Create category
* Update category
* Delete category
* Get categories

Endpoints

POST /categories

GET /categories

PUT /categories/:id

DELETE /categories/:id

---

### BE-03 Product CRUD API

Acceptance Criteria

* Create product
* Update product
* Delete product
* Get products
* Get product details

---

### BE-04 Inventory Update API

Acceptance Criteria

* Increase stock
* Decrease stock
* Prevent negative stock

---

### BE-05 Inventory History API

Acceptance Criteria

* Store inventory changes
* Return inventory history

---

### BE-06 Reports API

Acceptance Criteria

* Return stock totals per category

---

### BE-07 Filtering and Sorting

Acceptance Criteria

* Filter by category
* Filter by code
* Sort by name
* Sort by quantity

---

### BE-08 Error Handling

Acceptance Criteria

* Global error middleware
* Winston logging

---

### BE-09 Backend Tests

Acceptance Criteria

* 70%+ coverage

=================================================

## Frontend

### FE-01 Setup Angular

Acceptance Criteria

* Angular created
* Routing configured
* Angular Material configured

---

### FE-02 Application Layout

Acceptance Criteria

* Toolbar
* Navigation menu
* Responsive layout

---

### FE-03 Category Management Screen

Acceptance Criteria

* Category list
* Add category dialog
* Edit category dialog
* Delete category confirmation

---

### FE-04 Product List Screen

Acceptance Criteria

Display

* Code
* Name
* Price
* Quantity
* Category

Features

* Pagination
* Search
* Sorting
* Filtering

---

### FE-05 Product Details Screen

Acceptance Criteria

Display

* Product code
* Product name
* Price
* Quantity
* Category

---

### FE-06 Product Form

Acceptance Criteria

Create product

Edit product

Validation

* Required fields
* Price > 0
* Quantity >= 0

---

### FE-07 Inventory Update Screen

Acceptance Criteria

* Increase stock
* Decrease stock
* Display validation errors

---

### FE-08 Inventory History Screen

Acceptance Criteria

Display

* Date
* Product
* Old quantity
* New quantity
* Action

---

### FE-09 Reports Screen

Acceptance Criteria

Display stock totals per category

Example

Beverages: 120

Snacks: 80

Household: 50

---

### FE-10 Frontend Tests

Acceptance Criteria

* Service tests
* Component tests
* 70%+ coverage
