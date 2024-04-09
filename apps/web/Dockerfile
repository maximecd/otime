# Builder stage
FROM node:20-alpine as builder
WORKDIR /app
RUN npm install -g pnpm
COPY . .
# Build packages
RUN pnpm --filter schemas install --frozen-lockfile
RUN pnpm --filter schemas run build
# Build web app
RUN pnpm --filter web install --frozen-lockfile
RUN pnpm --filter web run build 
RUN pnpm deploy --filter web --prod /deploy

# Final stage
FROM nginx:alpine AS runtime
COPY --from=builder /deploy/build /usr/share/nginx/html
COPY --from=builder /deploy/nginx.conf /etc/nginx/conf.d/default.conf