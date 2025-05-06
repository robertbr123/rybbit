# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY ../shared/package.json ./shared/package.json
RUN npm ci
RUN cd shared && npm ci

# Copy source code
COPY . .
COPY ../shared ./shared

# Build the application
RUN npm run build

# Runtime image
FROM node:20-alpine

WORKDIR /app

# Install PostgreSQL client for migrations
RUN apk add --no-cache postgresql-client

# Copy built application and dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/GeoLite2-City.mmdb ./GeoLite2-City.mmdb
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/docker-entrypoint.sh /docker-entrypoint.sh
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/shared/node_modules ./shared/node_modules

# Make the entrypoint executable
RUN chmod +x /docker-entrypoint.sh

# Expose the API port
EXPOSE 3001

# Use our custom entrypoint script
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["node", "dist/index.js"]