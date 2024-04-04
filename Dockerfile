FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=web --prod /prod/web
RUN pnpm deploy --filter=api --prod /prod/api

FROM nginx:stable AS web
COPY --from=builder /prod/web/build /usr/share/nginx/html
COPY ./apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

FROM base AS api
WORKDIR /prod/api
COPY --from=builder /prod/api/build .
COPY --from=builder /prod/api/node_modules node_modules

EXPOSE 3001 
CMD [ "pnpm", "start" ]