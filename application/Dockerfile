# Use official Node.js image based on Alpine
FROM node:18-alpine

# Install necessary dependencies for Prisma
RUN apk add --no-cache libc6-compat openssl

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock* package-lock.json* ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app (if using production build)
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the Next.js application (for development, this might be overridden by docker-compose)
CMD ["npm", "run", "start"]
