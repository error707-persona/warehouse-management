FROM node:20-slim

RUN apt-get update && apt-get install -y openssl git && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
COPY kafka ./kafka
COPY tsconfig.json ./ 

RUN npm install
RUN npx prisma generate

COPY src ./src
RUN npm run build

CMD ["sh", "-c", "npx prisma migrate resolve --applied 0_init || true && npx prisma generate && npx prisma migrate deploy && npm start"]
