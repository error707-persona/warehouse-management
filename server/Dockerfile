# 1. Start with a Node image
FROM node:20-slim

# 2. Set the working directory
WORKDIR /usr/src/app

# 3. Copy only the files needed for installation (for caching)
COPY package.json package-lock.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the application code
COPY . .

# 6. Define the command to run the application
CMD [ "node", "server.js" ]