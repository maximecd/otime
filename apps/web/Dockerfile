# Builder stage
FROM node:20-alpine as builder
WORKDIR /app
RUN npm install -g pnpm
COPY . .
RUN pnpm --filter web install --frozen-lockfile
RUN pnpm --filter web run build 

# Final stage
FROM nginx:alpine AS runtime
COPY --from=builder /app/apps/web/build /usr/share/nginx/html
COPY --from=builder /app/apps/web/nginx.conf /etc/nginx/conf.d/default.conf