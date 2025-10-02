# -------------------------------
# Base image
# -------------------------------
FROM node:22-slim AS base

# -------------------------------
# Builder stage
# -------------------------------
FROM base AS builder

WORKDIR /app
RUN corepack enable
COPY . .

RUN pnpm install
RUN pnpm build
RUN pnpm deploy --filter server --prod /app/server_deploy

# -------------------------------
# Runtime stage
# -------------------------------
FROM base AS runner
WORKDIR /app

COPY --from=builder /app/packages/server/dist /app/dist
COPY --from=builder /app/server_deploy/node_modules /app/node_modules
COPY --from=builder /app/packages/client/dist /app/client_dist

ENV DIST_DIR=/app/client_dist
EXPOSE 3000

CMD ["node", "dist/trcp/routers/_app.js"]