# Use an official Node.js LTS image
FROM node:18-alpine AS base

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of your app
COPY . .

# Tell Render (and Docker) which port your app listens on
# Render sets PORT as an environment variable automatically
ENV PORT=8000
EXPOSE 8000

# Start the app
CMD ["npm", "run", "dev"]
