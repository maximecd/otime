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

FROM base AS web
WORKDIR /prod/app
COPY --from=builder /prod/web/ .
COPY --from=builder /prod/api/node_modules node_modules

EXPOSE 3000
CMD [ "node", "build" ]

FROM base AS api
WORKDIR /prod/api
COPY --from=builder /prod/api/build .
COPY --from=builder /prod/api/node_modules node_modules

EXPOSE 3001 
CMD [ "pnpm", "start" ]