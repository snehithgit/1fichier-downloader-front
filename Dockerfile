# Build stage
FROM --platform=linux/arm64 node:20 AS build

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Build the app
RUN npm run build:prod

# Production stage
FROM --platform=linux/arm64 caddy:alpine

# Install any required packages
RUN apk --no-cache add curl

# Create necessary directories with correct permissions
RUN mkdir -p /srv /data/caddy && \
    chmod -R 755 /srv /data/caddy

# Copy built app from build stage
COPY --from=build /usr/src/app/dist/vpsdownloader/browser /srv

# Copy Caddy configuration
COPY ./docker/caddy/Caddyfile /etc/caddy/Caddyfile

# Set proper permissions
RUN chmod -R 755 /srv && \
    chown -R 1000:1000 /srv /data/caddy

# Expose ports
EXPOSE 80

# Run as non-root user (nobody)
USER 1000:1000

# Run Caddy
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
