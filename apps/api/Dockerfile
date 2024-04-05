# Base image
FROM node:20-alpine as base
RUN npm install -g pnpm

# All deps stage
FROM base AS deps
WORKDIR /app
COPY . .
RUN pnpm --filter api install --frozen-lockfile

# Build stage
FROM base AS builder
COPY --from=deps . .
WORKDIR /app/apps/api
RUN node ace build

# Production only deps stage
FROM base AS production-deps
WORKDIR /app
COPY . .
RUN pnpm --filter api install --frozen-lockfile
RUN pnpm deploy --filter=api --prod /prod

# Production stage
FROM base
ENV NODE_ENV=production
WORKDIR /app
COPY --from=production-deps /prod/node_modules ./node_modules
COPY --from=builder /app/apps/api/build .
EXPOSE 8080
CMD ["node", "./bin/server.js"]