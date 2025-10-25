# Use Node.js 18
FROM node:18-alpine

WORKDIR /

COPY package*.json ./

# Install all dependencies (not just production)
COPY package*.json ./
RUN npm cache clean --force && npm install

COPY . .

EXPOSE 8000
CMD ["npm", "run", "dev"]
