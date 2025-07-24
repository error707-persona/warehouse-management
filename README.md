# 🗃️ Inventory Management System
A powerful and intuitive Inventory Management System built to help businesses track stock, manage products, handle orders, and gain insights — all in one place.

⚡ Built with performance, scalability, and clean architecture in mind.

# 📌 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Tests](#tests)
- [API Reference](#api-reference)
- [Future Enhancements](#future-enhancements)
- [Contact](#contact)

## 📖About the Project
This Inventory Management System was developed to streamline the process of managing stock and product data, enabling users to add, update, monitor, and analyze inventory in real time.

Whether you're managing a warehouse, retail store, or small business, this system aims to reduce complexity and improve efficiency.

## 🚀Features
🔐 Authentication & Role Management

Secure login/logout

Admin vs. user access levels

📦 Product Management

Add, update, or delete products

Track SKU, price, and descriptions

📊 Inventory Tracking

Monitor stock levels

Low stock alerts

🛒 Order Management

Create and fulfill purchase/sales orders

Update inventory automatically

🔍 Search and Filter

Fast lookup for products

📈 Dashboard Insights

Visual overview of key metrics (stock, orders, expense etc.)

🧾 Audit Logs

Track who made changes and when

✉️ Notification System (Optional with Kafka or WebSockets)

Real-time alerts for stock updates or new orders

🖼️ Responsive UI

Works smoothly across desktop and mobile devices

🧰 Tech Stack
Frontend	Backend	Database	Others
Nextjs + TypeScript,	Node.js + Express	PostgreSQL,	JWT, Kafka, Redux Toolkit, TailwindCSS

# 🛠️Installation
Clone the repository

bash
Copy
Edit
git clone https://github.com/yourusername/inventory-management.git
cd inventory-management
Install dependencies

bash
Copy
Edit
# For backend
cd server
npm install

### For frontend
cd ../client
npm install
Setup environment variables

Copy .env.example to .env and fill in your values.

Run the application

bash
Copy
Edit
### Backend
cd server
npm run dev

### Frontend
cd ../client
npm run dev

# 📎 Usage
Sign up or log in as an admin.

Add new products, certain pages can only be accessible by admin, inventory clerk and manager cannot access users page.

View real-time inventory updates as sales/purchase orders are created.

Receive low-stock alerts and restock as needed.

Access logs and performance reports from the dashboard.

# 📊Screenshots
<img width="1913" height="945" alt="image" src="https://github.com/user-attachments/assets/108b1e92-a49c-4b36-8b1d-c4ab67c22b82" />
<img width="1917" height="953" alt="image" src="https://github.com/user-attachments/assets/2d326666-b3f6-4494-8ba3-6b63a85781f9" />
<img width="1916" height="963" alt="image" src="https://github.com/user-attachments/assets/892bf76c-c8fc-4334-93de-20019f217746" />
<img width="1893" height="931" alt="image" src="https://github.com/user-attachments/assets/30b1b0b1-83fa-4277-a8a5-9fecf5180da8" />


# 📦API Reference

h
Copy
Edit
GET /api/products
POST /api/orders
PUT /api/products/:id
DELETE /api/users/:id

# 🧩Future Enhancements
✅ Barcode scanning support

✅ Export reports (PDF/Excel)

✅ Multi-warehouse support

✅ Dark mode (because why not?)

✅ Integration with third-party platforms (e.g., Shopify)

# 📬Contact
Made with ❤️ by Areesha Sayed

Have suggestions or want to collaborate? Feel free to reach out via areeshasayed786@gmail.com
