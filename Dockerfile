FROM golang:1.22-alpine as builder

WORKDIR /app

COPY go.* ./
RUN go mod download

COPY . .
RUN go mod vendor
RUN go build -mod=vendor -o main

FROM alpine:3.19

LABEL maintainer="Developer"
LABEL description="Go application container"

RUN adduser -D appuser

WORKDIR /app

COPY --from=builder /app/main .


USER appuser

CMD ["./main"]
