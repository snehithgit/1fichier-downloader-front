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

# Copy built app from build stage
COPY --from=build /usr/src/app/dist/vpsdownloader/browser /srv

# Copy Caddy configuration
COPY ./docker/caddy/Caddyfile /etc/caddy/Caddyfile

# Create necessary directories and set permissions
RUN mkdir -p /data/caddy \
    && chown -R caddy:caddy /srv /data/caddy \
    && chmod -R 755 /srv

# Expose ports
EXPOSE 80

# Set user
USER caddy

# Run Caddy
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
