# Use an official Node.js runtime as a base image
FROM node:20.11.0

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run your application, ensure that index.js is the correct entry point
CMD ["node", "index.js"]
