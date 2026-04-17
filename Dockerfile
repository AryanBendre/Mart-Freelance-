# Use Node 22 to satisfy EBADENGINE requirements
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Install Python and build tools required for compiling native modules like better-sqlite3
RUN apk add --no-cache python3 make g++

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the project files
COPY . .

# Build the Vite frontend and TS backend
RUN npm run build

# Hugging Face Spaces requires exposing port 7860
EXPOSE 7860
ENV PORT=7860

# Start the Node server
CMD ["npm", "start"]
