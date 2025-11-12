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

---

cd frontend
npm install
npm run dev

---

Запуск через Docker

docker-compose up --build


API доступне на http://localhost:4000

Фронтенд доступний на http://localhost:5173

PostgreSQL працює на порту 5432

## Основні можливості
- Реєстрація користувача (`POST /auth/register`)
- Авторизація користувача (`POST /auth/login`) з JWT токеном
- Отримання даних про поточного користувача (`GET /me`)
- CRUD для проєктів:
  - `GET /projects` — список
  - `POST /projects` — створення
  - `PUT /projects/:id` — оновлення
  - `DELETE /projects/:id` — видалення
- Health‑check (`GET /health`) для перевірки роботи API

---

## Як скачати з GitHub
```bash
git clone https://github.com/codreise/Client Portal MVP.git
cd client-portal