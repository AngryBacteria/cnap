FROM node:slim
WORKDIR /app

# Copy all files
COPY . .

# Install dependencies for backend
WORKDIR /app/server
RUN npm ci && npm run build

# Install dependencies for frontend
WORKDIR /app/client
RUN npm ci && npm run build

# Expose the ports for both backend and frontend
WORKDIR /app/server
EXPOSE 3000

CMD ["npm", "run", "start"]