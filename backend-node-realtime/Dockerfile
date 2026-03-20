FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files from the current directory (backend-node-realtime)
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the rest of the backend-node-realtime code
COPY . .

# Expose the Realtime Socket IO port
EXPOSE 3001

# Command to run the application
CMD ["node", "server.js"]
