# Use the official Node.js base image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package files to the container and install dependencies
COPY package*.json ./
RUN npm install


ENV JWT_SECRET=wbiu83pugbw2iougvbawi7udg
ENV accountname=abelmuro93
ENV password=Pz1l94Z5DTsnQLYv
ENV database=world-class-chess-database
ENV cluster=Cluster0
ENV email=abelmuro93@gmail.com
ENV app_password="mfcl uiwx tueo leid"

# Copy the rest of the application files
COPY . .

# Expose the port your app will run on
EXPOSE 8080

# Define the command to run your application
CMD ["npm", "start"]