# Use Node.js 18
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install all dependencies (not just production)
RUN npm ci

COPY . .

EXPOSE 8000
CMD ["npm", "run", "dev"]
