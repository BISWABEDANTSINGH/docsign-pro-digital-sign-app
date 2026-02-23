# DocSign Pro 📄✍️

DocSign Pro is a full-stack web application that allows users to securely upload PDF documents, place and resize digital signatures onto specific pages, and generate a final, flattened PDF for download. 

## 🌟 Key Features

* **Secure Authentication:** User registration and login powered by JSON Web Tokens (JWT).
* **Interactive Dashboard:** Manage, track, and filter documents by their status (Pending, Signed).
* **PDF Document Viewer:** Built-in multi-page PDF rendering.
* **Smart Signature Placement:** Visually drag, drop, and resize signatures anywhere on the document using interactive bounding boxes.
* **Server-Side PDF Flattening:** Signatures are permanently embedded (flattened) into the original PDF using exact mathematical coordinates.
* **File Management:** Upload new documents and delete old ones directly from the UI.

## 🛠️ Tech Stack

**Frontend (Client)**
* React.js (Bootstrapped with Vite)
* React Router (Single Page Application routing)
* `react-pdf` (High-fidelity PDF rendering)
* `react-rnd` (Resizable and draggable signature components)
* Axios (API communication)

**Backend (Server)**
* Node.js & Express.js
* MongoDB & Mongoose (Database & Models)
* `pdf-lib` (Core PDF generation and image embedding)
* `multer` (Multipart file uploading)
* `jsonwebtoken` & `bcryptjs` (Auth & Security)

---

## 🚀 Local Setup & Installation

Follow these steps to run the project on your local machine.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed and a [MongoDB](https://www.mongodb.com/atlas/database) database URI.

### 1. Clone the repository
```bash
git clone [https://github.com/YOUR_USERNAME/docsign-pro.git](https://github.com/YOUR_USERNAME/docsign-pro.git)
cd docsign-pro
