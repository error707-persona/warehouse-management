FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Set your database connection (use your actual connection string or secret)
ENV DATABASE_URL="postgresql://inventory_db_oxg5_user:jaeRgrrPCktonHEWYUdSmbGu2eUo7rKS@dpg-d3t6762li9vc73dpp4j0-a.oregon-postgres.render.com/inventory_db_oxg5"

# Generate Prisma client only (skip pushing during build)
RUN npx prisma generate

EXPOSE 8000
CMD ["npm", "run", "dev"]
