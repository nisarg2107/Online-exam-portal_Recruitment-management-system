# Online Exam Portal / Recruitment Management System

A full stack exam and recruitment management system with a Spring Boot backend and a React front end. It provides an admin console to manage users, roles, categories, difficulties, questions, exams and student assignments, and a student experience to take exams and view results. This README is generated from the actual codebase inside the provided zip.

## Project Layout

```
online-exam-portal-backend/   # Spring Boot 2.7.x, Maven
online-exam-portal-frontend/  # React 18 + Redux Toolkit + Ant Design (CRA)
```

## Tech Stack

- **Backend**: Java 17, Spring Boot 2.7.17, Spring Web, Spring Data JPA, Spring Security with JWT, Lombok, MySQL Connector (MariaDB/MySQL compatible)
- **Frontend**: React 18, react-router-dom, Redux Toolkit, Ant Design 5, axios, moment, crypto-js
- **Auth**: JWT bearer tokens; default users are seeded at startup

## Quick Start

### 1) Database

Configure a local MySQL or MariaDB instance. The backend defaults are:

```
URL      : jdbc:mysql://localhost:3306/OnlineExamPortal?createDatabaseIfNotExist=true
Username : root
Password : root
Dialect  : MySQL8
```

Update these in `online-exam-portal-backend/src/main/resources/application.properties` if needed.

### 2) Backend

```bash
cd online-exam-portal-backend
./mvnw spring-boot:run   # or: mvn spring-boot:run
```
- Runs on **port 8089** (configured in `application.properties`).
- CORS is open for all origins by default (`WebConfig`), suitable for local dev.

**Seeded accounts** (created on first run by `DBOperationRunner`):
- Admin: `admin@gmail.com` / `Admin@123`
- User : `john@gmail.com`  / `John@123`

**JWT settings**:
- Secret: set in `application.properties` under `application.security.jwt.secret-key`
- Expiration: `application.security.jwt.expiration` (defaults to one day)

### 3) Frontend

```bash
cd online-exam-portal-frontend
npm install
npm start
```
- Runs on **http://localhost:3000**
- The app calls the backend at `http://localhost:8089` (slices use absolute URLs such as `http://localhost:8089/category/` and `http://localhost:8089/auth/login`). Adjust if your backend uses a different host or port.

## Key Features

- Manage **roles**, **users**, **categories**, **difficulties**
- Create and update **questions** with options and difficulty
- Assemble **exams**, generate exam papers by category or difficulty
- Assign exams to students, track attempts and responses
- JWT based login and authorization, role aware routes on the frontend

## Authentication Endpoints

The auth controller is mounted at `/auth`:
- `POST /auth/login` — returns a JWT for valid credentials
- `POST /auth/register` — create a new user
- `POST /auth/validate` — validate token

Use the returned token as `Authorization: Bearer <token>` on protected routes.

## Representative API Endpoints

Below is an automatically extracted snapshot of REST endpoints from the controllers:

- `DELETE /category/{id}`  (CategoryController.java)
- `GET /category/`  (CategoryController.java)
- `GET /category/{id}`  (CategoryController.java)
- `POST /category/`  (CategoryController.java)
- `PUT /category/{id}`  (CategoryController.java)
- `DELETE /difficulty/{id}`  (DifficultyController.java)
- `GET /difficulty/`  (DifficultyController.java)
- `GET /difficulty/{id}`  (DifficultyController.java)
- `POST /difficulty/`  (DifficultyController.java)
- `PUT /difficulty/{id}`  (DifficultyController.java)
- `DELETE /exam/{id}`  (ExamController.java)
- `GET /exam/`  (ExamController.java)
- `GET /exam/{id}`  (ExamController.java)
- `POST /exam/`  (ExamController.java)
- `POST /exam/generate`  (ExamController.java)
- `POST /exam/generate/category`  (ExamController.java)
- `PUT /exam/{id}`  (ExamController.java)
- `DELETE /exam/{examId}/question/{questionId}`  (ExamQuestionController.java)
- `GET /exam/question`  (ExamQuestionController.java)
- `GET /exam/question/{questionId}`  (ExamQuestionController.java)
- `GET /exam/{examId}/question`  (ExamQuestionController.java)
- `GET /exam/{examId}/question/{questionId}`  (ExamQuestionController.java)
- `POST /exam/{examId}/question/{questionId}`  (ExamQuestionController.java)
- `PUT /exam/{examId}/question/{questionId}`  (ExamQuestionController.java)
- `DELETE /image/{id}`  (ImageController.java)
- `GET /image/`  (ImageController.java)
- `GET /image/{id}`  (ImageController.java)
- `POST /image/`  (ImageController.java)
- `PUT /image/{id}`  (ImageController.java)
- `POST /auth/login`  (LoginController.java)
- `POST /auth/register`  (LoginController.java)
- `POST /auth/validate`  (LoginController.java)
- `DELETE /option/{id}`  (OptionController.java)
- `GET /option/`  (OptionController.java)
- `GET /option/{id}`  (OptionController.java)
- `POST /option/`  (OptionController.java)
- `PUT /option/{id}`  (OptionController.java)
- `DELETE /question/{id}`  (QuestionController.java)
- `GET /question/`  (QuestionController.java)
- `GET /question/{id}`  (QuestionController.java)
- `POST /question/`  (QuestionController.java)
- `PUT /question/{id}`  (QuestionController.java)
- `DELETE /role/{id}`  (RoleController.java)
- `GET /role/`  (RoleController.java)
- `GET /role/{id}`  (RoleController.java)
- `POST /role/`  (RoleController.java)
- `PUT /role/{id}`  (RoleController.java)
- `DELETE /student/{studentId}/exam/{examId}`  (StudentExamController.java)
- `GET /student/exam`  (StudentExamController.java)
- `GET /student/exam/{examId}`  (StudentExamController.java)
- `GET /student/{studentId}/exam`  (StudentExamController.java)
- `GET /student/{studentId}/exam/{examId}`  (StudentExamController.java)
- `POST /student/{studentId}/exam/{examId}`  (StudentExamController.java)
- `PUT /student/{studentId}/exam/{examId}`  (StudentExamController.java)
- `PUT /student/{studentId}/exam/{examId}/status`  (StudentExamController.java)
- `DELETE /student/{studentId}/exam/{examId}/question/{questionId}`  (StudentExamQuestionAnswerResponseController.java)
- `GET /student/exam/question`  (StudentExamQuestionAnswerResponseController.java)
- `GET /student/exam/question/{questionId}`  (StudentExamQuestionAnswerResponseController.java)
- `GET /student/exam/{examId}/question`  (StudentExamQuestionAnswerResponseController.java)
- `GET /student/{studentId}/exam/question`  (StudentExamQuestionAnswerResponseController.java)
- `GET /student/{studentId}/exam/{examId}/check`  (StudentExamQuestionAnswerResponseController.java)
- `GET /student/{studentId}/exam/{examId}/question`  (StudentExamQuestionAnswerResponseController.java)
- `GET /student/{studentId}/exam/{examId}/question/{questionId}`  (StudentExamQuestionAnswerResponseController.java)
- `POST /student/{studentId}/exam/{examId}/question/{questionId}`  (StudentExamQuestionAnswerResponseController.java)
- `PUT /student/{studentId}/exam/{examId}/question/{questionId}`  (StudentExamQuestionAnswerResponseController.java)
- `PUT /student/{studentId}/exam/{examId}/question/{questionId}/marks/{marks}`  (StudentExamQuestionAnswerResponseController.java)
- `DELETE /user/{id}`  (UserController.java)
- `GET /user/`  (UserController.java)
- `GET /user/{id}`  (UserController.java)
- `POST /user/`  (UserController.java)
- `PUT /user/{id}`  (UserController.java)

> Note: Some endpoints support paging via `pageNumber` and `pageSize`. Refer to controller methods for request bodies and query params.

## Frontend Structure

- `src/components/admin/*` — dashboards for categories, difficulties, questions, exams, roles, users, and viewing exam responses
- `src/components/user/*` — student dashboards and exam taking flow
- `src/features/*` — Redux Toolkit slices; each slice defines async thunks that call backend endpoints (for example `categoryDetailSlice.js` uses `http://localhost:8089/category/`)
- `src/app/store.js` — store configuration

## Environment and Configuration Tips

- Change the JWT secret before production
- Replace hard coded API base URLs in Redux slices if you deploy with a different host or path
- Use `spring.jpa.hibernate.ddl-auto=validate` in production and manage schema with migrations

## Scripts

**Backend**:
- `mvn clean package`
- `mvn spring-boot:run`

**Frontend**:
- `npm start` — dev server
- `npm run build` — production build
