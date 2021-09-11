FROM golang:1.17-bullseye AS build-backend
COPY . /src
WORKDIR /src
RUN CGO_ENABLED=0 go build -o /src/server .

FROM node:16 AS build-frontend
COPY . /src
WORKDIR /src/client
RUN npm install && npx ng build

FROM alpine:latest
RUN mkdir /app
COPY --from=build-backend /src/server /app/server
COPY --from=build-frontend /src/client/dist/client/ /app/assets

CMD ["/app/server"]

