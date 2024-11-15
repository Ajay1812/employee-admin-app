# Set the base image for the React app
FROM node:23-alpine

WORKDIR /app

# Copy the server's package.json and package-lock.json separately to install server dependencies
COPY server/package*.json ./server/

# Copy the admin-client's package.json and package-lock.json separately to install client dependencies
COPY admin-client/package*.json ./admin-client/

# Temporarily switch to root to install dependencies
USER root

# Install dependencies for the server
WORKDIR /app/server
RUN rm -rf node_modules
RUN npm install

# Install dependencies for the admin client
WORKDIR /app/admin-client
RUN npm install

# Copy the rest of the files to the working directory
WORKDIR /app
COPY . .

WORKDIR /app/server

EXPOSE 3000

# Command to run the app
CMD ["npm", "run", "start"]
