# Base
FROM node:20-alpine as base
WORKDIR /app
RUN npm install -g pnpm
COPY . .

# Builder stage
FROM base as builder
RUN pnpm --filter api install --frozen-lockfile
RUN pnpm --filter api run build 

# Prod deps
FROM base as prod-deps
RUN pnpm deploy --filter api --prod /deploy

# Final stage
FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=prod-deps /deploy/node_modules node_modules
COPY --from=builder /app/apps/api/build .
EXPOSE 3000
CMD ["node", "bin/server.js"]