# Use the official Node.js image with Alpine as the base image
FROM node:alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code to the working directory
COPY . .

# Expose the port that the application will run on
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]
