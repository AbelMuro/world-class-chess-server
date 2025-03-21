# Use the Node.js base image
FROM node:16-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app’s files
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Run the app
CMD ["node", "index.js"]