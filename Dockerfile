FROM node:16.15.1
WORKDIR /wd
COPY ./web/package.json ./web/package.json
COPY ./web/yarn.lock ./web/yarn.lock
RUN cd web && yarn
COPY ./web/router.js ./web/router.js
COPY ./web/data ./web/data
COPY ./web/src ./web/src
COPY ./data ./data
RUN cd web && yarn build
RUN mv ./web/dist /dist
