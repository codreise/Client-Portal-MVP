FROM node:18

# Робоча директорія
WORKDIR /app

# Копіюємо тільки package.json і package-lock.json
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо решту коду
COPY . .

# Відкриваємо порт
EXPOSE 4000

# Запускаємо сервер у продакшн-режимі
CMD ["npm", "start"]