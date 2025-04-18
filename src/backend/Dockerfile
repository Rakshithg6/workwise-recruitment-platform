# Use official Node.js image as base
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy backend files
COPY . .

# Install dependencies if package.json exists
RUN if [ -f package.json ]; then npm install; fi

# Expose port (adjust if your backend uses a different port)
EXPOSE 5000

# Default command (adjust if you want to run Python instead)
CMD [ "node", "server.js" ]
