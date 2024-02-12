# Use a specific version of Node.js to ensure consistency
FROM node:20.11.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json separately to leverage Docker layer caching
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install

# Expose port 3000 for the application
EXPOSE 3000

# Copy the rest of the application code
COPY . .

# Specify the command to run your application
CMD ["node", "app.js"]
