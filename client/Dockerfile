# Stage 1: Build the app
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Serve the app using a minimal image
FROM node:18-alpine

# Set environment variables
ENV NODE_ENV production

# Set working directory
WORKDIR /app

# Copy the built app from the builder stage
COPY --from=builder /app ./

# Install production dependencies
RUN npm install --only=production

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
