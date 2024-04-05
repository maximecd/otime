# Builder stage
FROM node:20-alpine as builder

# Set the working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy the entire monorepo
COPY . .

# Install dependencies and build
RUN pnpm --filter web install
RUN pnpm --filter web run build 

# Final stage
FROM arm64v8/nginx:alpine AS runtime
COPY --from=builder /app/apps/web/build /usr/share/nginx/html
COPY --from=builder /app/apps/web/nginx.conf /etc/nginx/conf.d/default.conf