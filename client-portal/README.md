# Client Portal MVP

## Опис
Client Portal — це full‑stack проєкт, який складається з:
- **Backend (Node.js + Express + PostgreSQL)**  
  Реалізує REST API для реєстрації, авторизації користувачів та управління проєктами.
- **Frontend (React + Vite)**  
  Інтерфейс для взаємодії з API: реєстрація, логін, перегляд та створення проєктів.
- **Docker**  
  Використовується для контейнеризації бекенду, фронтенду та бази даних.
  
## Запуск локально

### Backend
```bash
cd backend
npm install
npm start

Frontend

cd frontend
npm install
npm run dev

Запуск через Docker

docker-compose up --build

API доступність

http://localhost:4000 — базова адреса бекенду. Використовується як корінь для всіх REST‑маршрутів (/auth, /me, /projects тощо). Якщо відкрити напряму в браузері, може повернути 404, бо root‑маршрут не визначений.

http://localhost:4000/health — спеціальний health‑check endpoint. Виконує простий запит до бази (SELECT NOW()) і повертає JSON:

### { "status": "ok", "now": "2025-11-26T15:42:00.000Z" }

Фронтенд доступний на: http://localhost:5173

PostgreSQL працює на порту: 5432

можливості
Реєстрація користувача (POST /auth/register)

Авторизація користувача (POST /auth/login) з JWT токеном

Отримання даних про поточного користувача (GET /me)

CRUD для проєктів:

GET /projects — список
POST /projects — створення
PUT /projects/:id — оновлення
DELETE /projects/:id — видалення

## Як скачати з GitHub
```bash
git clone https://github.com/codreise/Client Portal MVP.git
cd client-portal