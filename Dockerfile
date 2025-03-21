# Use the Node.js base image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

ENV JWT_SECRET=wbiu83pugbw2iougvbawi7udg
ENV accountname=abelmuro93
ENV password=Pz1l94Z5DTsnQLYv
ENV database=world-class-chess-database
ENV cluster=Cluster0
ENV email=abelmuro93@gmail.com
ENV app_password=mfcl uiwx tueo leid

# Copy the rest of the app’s files
COPY . .

# Expose the port your app runs on
EXPOSE 4000

# Run the app
CMD ["node", "src/index.js"]