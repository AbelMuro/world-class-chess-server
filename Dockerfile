# Use the Node.js base image
FROM node:16-alpine

# Set the working directory
WORKDIR /usr/src/app/src

# Copy package files and install dependencies
COPY package*.json ./
COPY src ./src
RUN npm install --production

# Copy the rest of the app’s files
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Run the app
CMD ["node", "index.js"]