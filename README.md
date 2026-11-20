# NovaCart

**Your Budget. Your Deals. Your World.**

NovaCart is a multi-vendor e-commerce website for customers in Bangladesh (prices in BDT). It connects customers with different sellers on one platform and has a separate dashboard for each of five user roles. It is the group project for **CSC 3215 Web Technologies** (Fall 26-27, AIUB), Group 2, Section S.

> **Project status:** front-end prototype. All pages are built with HTML, CSS and JavaScript only. There is no server, database or real authentication yet. A PHP and MySQL back end is planned for the next phase (see [Roadmap](#roadmap)).

## Features

### Common to the user roles
- One shared login page with a show/hide password option and an error message for wrong credentials. After login each role opens its own dashboard.
- One registration page for **Customer**, **Seller** and **Delivery Partner** accounts. Each type has its own extra fields. The form checks required fields, email format, a Bangladeshi mobile number, a password of at least 8 characters with a number, matching confirmation and acceptance of the terms.
- Log out from every dashboard.
- Change password (Customer, Seller, Manager, Administrator) and profile management.

### By role

| Role | What it can do in the prototype |
|---|---|
| **Customer** | Dashboard with recent orders; browse products by category and search; cart with quantity changes and an order form (address, phone, payment method, note); order history with status filter, address edit and cancel; student verification and coupons (EID20, BOISHAKH15, STUDENTS15, EID100; one coupon at a time, student coupon needs verified status); notifications; profile and change password. |
| **Seller** | Dashboard with summary cards and a personal task list; products and inventory (add, edit, delete, search, low-stock count); orders with status dropdown and notes; sales and commission view and promotion requests; profile with photo, store details, store policies and change password. |
| **Manager** | Operations overview; promotional campaigns (create, edit, delete, filter by status; active campaigns cannot be deleted until set to Expired); order monitoring with charts and complaint resolution; revenue-by-store report and CSV download; profile with photo and change password. |
| **Administrator** | Dashboard with activity list; user and role management (add, edit, delete, filter, search, Active/Suspended); seller verification; product moderation; platform settings (commission, categories, coupon policies); analytics, notifications and activity log; profile with picture and change password. |
| **Delivery Partner** | Assigned deliveries (search, filter, add, edit, delete, view details); update status (Picked Up, Out for Delivery, Delivered, Failed Delivery, with a required reason for failed); delivery history by period; report, edit and delete delivery issues. |

## Tech stack

- **HTML5** for page structure
- **CSS3** (one external stylesheet per area) for styling
- **JavaScript (ES6)** for form validation, DOM manipulation and page behaviour

Planned for the next phase: PHP (MVC structure, sessions and cookies), MySQL, and AJAX with JSON.

## Project structure

```
NovaCart/
├── LOGIN/          login page (HTML, CSS, JS)
├── REGISTRATION/   registration page (HTML, CSS, JS)
├── HTML/           role pages: customer, seller (dashboard, products,
│                   orders, promotions, profile), manager, admin, delivery
├── CSS/            stylesheets for the role pages
├── JS/             scripts for the role pages
├── ICONS/          SVG icons
└── PICTURES/       profile pictures
```

## How to run

No installation or build step is needed.

1. Download or clone the repository.
2. Open `LOGIN/HTML/login.html` in a browser (double-click it, or use an extension such as VS Code Live Server).
3. Log in with one of the demo accounts below.

### Demo accounts

These accounts are written in `LOGIN/JS/login.js` for testing only.

| Role | Email | Password |
|---|---|---|
| Customer | lubaba@novacart.com | customer123 |
| Seller | sazin@novacart.com | seller123 |
| Manager | fahad@novacart.com | manager123 |
| Administrator | ameya@novacart.com | admin123 |
| Delivery Partner | razeen@novacart.com | delivery123 |

## Limitations

- **Front end only.** Data on the pages is sample data in JavaScript arrays and resets when the page is reloaded. Only the Seller order list and order notes are saved in the browser (`localStorage`).
- **Registration does not save accounts.** The form is validated and shows a success message, but the new account is not stored and cannot log in.
- **Login is not secure.** The demo accounts and passwords are in client-side code. Real authentication will be done on the server.
- **Not built yet:** forgot/reset password, and a profile and change-password page for the Delivery Partner.
- **No real payments.** The payment method is only chosen in the checkout form.
- **Store rating** on the seller dashboard is a sample value, not calculated.

## Roadmap

- PHP back end in an MVC structure with server-side validation
- MySQL database (users, products, orders, deliveries, campaigns and so on)
- Sessions and cookies for login and role-based access, hashed passwords
- AJAX with JSON for search, cart and status updates
- Forgot/reset password and the missing Delivery Partner profile page

## Team

| ID | Name | Role |
|---|---|---|
| 24-57525-2 | Aryan Afsar Ameya | Group Leader |
| 24-57614-2 | Mohammed Mahir Absar Sazin | Member |
| 24-58779-2 | Lubaba Zannatul Haque | Member |
| 24-57981-2 | MD. Abdur Rahman | Member |
| 24-58568-2 | Ahnam Razeen Khan | Member |

American International University-Bangladesh (AIUB), Faculty of Science and Technology, Department of Computer Science.
