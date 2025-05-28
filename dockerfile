FROM node:slim

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN pnpm install && pnpm run build

# Expose the ports for both backend and frontend
EXPOSE 3000

CMD ["pnpm", "run", "start:server"]