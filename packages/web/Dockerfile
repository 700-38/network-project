# Use the official Node.js  LTS image as base
FROM oven/bun:latest AS builder

ARG NEXT_PUBLIC_SOCKET_ENDPOINT
ARG NEXT_PUBLIC_ATLAS_APP_ID
ARG NEXT_PUBLIC_ATLAS_API_KEY
ARG NEXT_PUBLIC_TEST

ENV NEXT_PUBLIC_SOCKET_ENDPOINT $NEXT_PUBLIC_SOCKET_ENDPOINT
ENV NEXT_PUBLIC_ATLAS_APP_ID $NEXT_PUBLIC_ATLAS_APP_ID
ENV NEXT_PUBLIC_ATLAS_API_KEY $NEXT_PUBLIC_ATLAS_API_KEY
ENV NEXT_PUBLIC_TEST $NEXT_PUBLIC_TEST

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to container
COPY --from=realm ./package*.json .
COPY --from=realm ./bun.lockb .

# Copy package.json and package-lock.json to container
COPY ./package*.json ./packages/web/

RUN bun install

# Copy the rest of the application code
COPY . ./packages/web/

# Copy shared folder
COPY --from=shared . ./shared

RUN echo $NEXT_PUBLIC_SOCKET_ENDPOINT >> test.txt
RUN echo $NEXT_PUBLIC_ATLAS_APP_ID >> test.txt
RUN echo $NEXT_PUBLIC_ATLAS_API_KEY >> test.txt
RUN echo $NEXT_PUBLIC_TEST >> test.txt

# Build the Next.js application with export
RUN cd ./packages/web && bun run build

# Final image
FROM nginx:alpine

# Copy the built files from the previous stage
COPY --from=builder /app/test.txt test.txt

COPY --from=builder /app/packages/web/out /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
