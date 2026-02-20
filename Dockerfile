# Use official Node image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy dependency files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the app
COPY . .

# Expose app port (change if different)
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
