# Base image
FROM node:latest

# Install Docker CLI
RUN apt-get update && apt-get install -y docker.io

# Working directory
WORKDIR /exfilms/

# Copy project files
COPY . .

# Install dependencies
RUN npm install

# Run ExfilMS
ENTRYPOINT ["node", "src/exfilms.js"]