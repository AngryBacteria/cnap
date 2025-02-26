FROM node:22.14.0
WORKDIR /app

# Copy all files
COPY . .

# Install dependencies for backend and frontend if they have separate package\.json files
WORKDIR /app/server
RUN npm install
RUN npm run build

WORKDIR /app/client
RUN npm install
RUN  npm run build
RUN npm install -g serve

# Go back to the project root to copy the start script
WORKDIR /app
RUN chmod +x start.sh

# Expose the ports for both backend and frontend
EXPOSE 3000
EXPOSE 4173

CMD ["./start.sh"]