# Use Node.js 18 slim image (Debian-based)
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Remove any existing node_modules directory
RUN rm -rf node_modules

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create directory for database
RUN mkdir -p db

# Expose port
EXPOSE 3002

# Create volume for database persistence
VOLUME ["/app/db"]

# Start the application
CMD ["npm", "start"]