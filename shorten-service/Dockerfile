ARG version=24-alpine3.21

FROM node:${version} AS build
WORKDIR /shorten-service-build
COPY package.json .
COPY tsconfig.json .
COPY ./src/ ./src/
RUN npm install
RUN npm run build

FROM node:${version} AS shorten-service-prod
WORKDIR /shorten-service
COPY --from=build shorten-service-build/dist/ ./dist/
COPY --from=build shorten-service-build/package.json .
RUN npm install --only=production
CMD [ "npm","run","start:prod" ]
