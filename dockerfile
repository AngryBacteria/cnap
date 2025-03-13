FROM node:slim
WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN npm i && npm run build

# Expose the ports for both backend and frontend
EXPOSE 3000

CMD ["npm", "run", "start:server"]