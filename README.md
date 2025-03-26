# Amazon Product Scraper

This project is an Amazon product scraper, developed with Node.js, Express, Bun and a simple frontend with Vite and TailwindCSS.

## 🚀 Technologies Used

- **Backend:** Bun, Express, Axios, JSDOM
- **Frontend:** Vite, TailwindCSS
- **Parallel Execution:** Concurrently

## 📋 Configuration and Execution

### 1️⃣ Install Dependencies

Make sure you have **Bun** installed on your machine. If you don't, install it with:
```sh
curl -fsSL https://bun.sh/install | bash
```
Now, install the project dependencies:
```sh
bun install
```

### 2️⃣ Run the Project
To run the frontend and backend at the same time, use the following command:
```sh
bun run dev
```
This will run both the Express server and Vite simultaneously.

### 3️⃣ Access the Application
After starting the project, access:
```
Frontend: http://localhost:5173
Backend: http://localhost:3000/api/scrape?keyword=produto
```
Replace `produto` with the desired search term.

## 📜 Important Notes
- Amazon may block frequent requests. If you encounter a 503 error, try again later.
- The project uses Tailwind for styling, ensuring a responsive design.

💡 **Contributions and suggestions are welcome!**