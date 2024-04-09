# Base
FROM node:20-alpine as base
WORKDIR /app

# Builder stage
FROM base as builder
RUN npm install -g pnpm
COPY . .
# Build packages
RUN pnpm --filter schemas install --frozen-lockfile
RUN pnpm --filter schemas run build
# Build api
RUN pnpm --filter api install --frozen-lockfile
RUN pnpm --filter api run build
RUN pnpm deploy --filter api --prod /deploy

# Final stage 
FROM base AS runtime
COPY --from=builder /deploy/node_modules node_modules
COPY --from=builder /deploy/build .
EXPOSE 8080
CMD ["node", "bin/server.js"]