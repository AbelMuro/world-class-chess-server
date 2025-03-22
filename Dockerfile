#This is where i left off, i need to deploy a docker container with https


# Use the Node.js base image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app’s files
COPY . .

# Expose the port your app runs on
EXPOSE 4000

# Run the app
CMD ["node", "src/index.js"]