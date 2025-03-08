FROM node:slim
WORKDIR /app

# Copy all files
COPY . .

# Install dependencies for backend
WORKDIR /app/server
RUN npm install && npm run build

# Install dependencies for frontend
WORKDIR /app/client
RUN npm install && npm run build

# Expose the ports for both backend and frontend
EXPOSE 3000

CMD ["npm", "run", "start"]