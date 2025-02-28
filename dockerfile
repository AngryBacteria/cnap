FROM node:22.14.0
WORKDIR /app

# Copy all files
COPY . .

# Install dependencies for backend
WORKDIR /app/server
RUN npm install && npm run build

# Install dependencies for frontend
WORKDIR /app/client
RUN npm install && npm run build && npm install -g serve && npm cache clean --force

# Go back to the project root to copy the start script
WORKDIR /app
RUN chmod +x start.sh

# Expose the ports for both backend and frontend
EXPOSE 3000
EXPOSE 4173

CMD ["/bin/bash", "./start.sh"]