ARG version=24-alpine3.21

FROM node:${version} AS build
WORKDIR /redirect-service-build
COPY package.json .
COPY tsconfig.json .
COPY ./src/ ./src/
RUN npm install
RUN npm run build

FROM node:${version} AS redirect-service-prod
WORKDIR /redirect-service
COPY --from=build redirect-service-build/dist/ ./dist/
COPY --from=build redirect-service-build/package.json .
RUN npm install --only=production
CMD [ "npm","run","start:prod" ]
