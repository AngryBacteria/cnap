FROM node:slim
WORKDIR /app

# Copy all files
COPY . .

# Install dependencies for backend
RUN npm install && npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]