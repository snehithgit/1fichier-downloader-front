FROM node:23.7 AS build
# Create a Virtual directory inside the docker image
WORKDIR /dist/src/app
# Copy files to virtual directory
# COPY package.json package-lock.json ./
# Run command in Virtual directory
RUN npm cache clean --force
# Copy files from local machine to virtual directory in docker image
COPY . .
RUN npm install
RUN npm run build:prod



FROM caddy:latest

# Set the working directory for the final container
WORKDIR /app

# Copy the Angular build output to the final location
COPY --from=build /dist/src/app/dist/vpsdownloader/browser ./www

# Copy the Caddyfile to the final location
COPY ./docker/caddy/Caddyfile /etc/caddy/Caddyfile

# Expose the port for Caddy
EXPOSE 80

# Command to start Caddy
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
