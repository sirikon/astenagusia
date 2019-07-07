FROM node:10.16-alpine AS build
ADD package.json .
ADD package-lock.json .
RUN npm i --production
ADD src src/
RUN npm run build

FROM abiosoft/caddy:1.0.1-no-stats as final
ADD Caddyfile /etc/Caddyfile
COPY --from=build ./src/web/dist .
