# Use the official Node.js base image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package files to the container and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port your app will run on
EXPOSE 8080

# Define the command to run your application
CMD ["npm", "start"]