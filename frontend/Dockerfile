# Use Node.js image
FROM node:19

# Set working directory in the container
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Expose the port for Vite (or Next.js default port 3000)
EXPOSE 3000

# Run the application
CMD ["npm", "run", "dev"]
