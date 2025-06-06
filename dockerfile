FROM node:22-slim

# Set the working directory
WORKDIR /usr/src/app

# Create a non-root user and switch to it
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser
USER appuser

# Copy all files
COPY . .

# Install dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Expose the ports for both backend and frontend
EXPOSE 3000

CMD ["pnpm", "run", "start:server"]