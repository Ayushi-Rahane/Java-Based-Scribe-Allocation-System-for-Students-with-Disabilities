# Scribe Allocation System

A comprehensive, full-stack application designed to seamlessly connect Students with Disabilities to Verified Scribe Volunteers for their academic examinations.

## 🌟 Key Features

* **Secure Authentication:** Role-based access control for both Students and Volunteers.
* **Student Dashboard:** Track active requests, monitor matching status natively, and view historical scribe assignments.
* **Smart Scribe Requests:** Students can input exam details (subject, location, timing, and language preferences).
* **High-Capacity File Uploads:** During the request phase, students can attach essential study materials and syllabuses directly to the platform (up to 100MB per file).
* **Volunteer Matchmaking:** Real-time lifecycle tracking mapping requirements from `PENDING` to `MATCHED` to `COMPLETED`.
* **Dynamic Profiles:** In-app personal identity management and profile picture customization.

## 💻 Tech Stack

### Frontend Architecture
* **React** (powered by Vite for ultra-fast HMR)
* **Tailwind CSS** (for fully responsive, modern glassmorphism styling)
* **Lucide-React** (for beautiful, lightweight scalable iconography)
* **Context API** (for smooth global session handling)

### Backend Architecture
* **Java 21 & Spring Boot 3** (High-performance API infrastructure)
* **Spring Data MongoDB** (for rapid NoSQL querying)
* **MongoDB Atlas** (Cloud-hosted database layer)
* **Embedded Tomcat** (Running asynchronously on port 8080)
* **Multipart File Module** (Configured to intercept large PDF/Docx payloads securely)

## 📁 Project Structure

```bash
├── backend/                  # Spring Boot Java Application
│   ├── src/main/java/com/scribe/allocation/
│   │   ├── ScribeAllocationApplication.java
│   │   ├── controller/       # Rest API endpoints (Auth, Student, Request, Files)
│   │   ├── model/            # Object schemas mirroring NoSQL collections
│   │   ├── repository/       # MongoRepository interfaces
│   │   └── service/          # Business logic and local file storage handling
│   └── uploads/              # Dynamic local storage pool for study materials
│
├── frontend/                 # React UI Application
│   ├── src/
│   │   ├── components/       # Reusable components (Forms, Sidebar, Inputs)
│   │   ├── config/           # Environment and network endpoints configuration
│   │   ├── context/          # `AuthContext` managing authentication tokens globally
│   │   ├── pages/            # View-level components (Profile, Dashboard, Requests)
│   │   └── services/         # Async REST fetching modules linking to `localhost:8080`
└── README.md
```

## 🚀 Setup & Execution

### 1. Database Configuration
* Ensure you have a MongoDB instance available.
* In `/backend/src/main/resources/application.properties`, configure your connection string:
  ```properties
  spring.data.mongodb.uri=mongodb+srv://<username>:<password>@cluster/scribe
  spring.servlet.multipart.max-file-size=100MB
  spring.servlet.multipart.max-request-size=100MB
  ```

### 2. Run the Spring Boot Server
You must have Java 21 available on your engine. Navigate into your backend IDE or terminal.
```bash
cd backend
./mvnw spring-boot:run
```
*Wait until the Tomcat runtime initializes on port `8080`.*

### 3. Run the React Client
Open a secondary terminal:
```bash
cd frontend
npm install
npm run dev
```
*Open your browser to the local network port indicated by Vite (usually `http://localhost:5173`).*

---
*Built with care to provide accessibility and ease of use.*