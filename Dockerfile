# Use a lightweight Node image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

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
