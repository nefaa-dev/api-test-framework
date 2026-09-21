# Node 20 LTS on Debian slim. No Playwright browsers — this is API-only testing,
# so we deliberately avoid the heavy official Playwright image.
FROM node:20-bookworm-slim

# Java runtime, needed ONLY to generate/serve Allure reports inside the container.
RUN apt-get update \
  && apt-get install -y --no-install-recommends default-jre-headless \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy manifests and install — this layer is cached and only re-runs when dependencies change
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the framework.
COPY . .

# Default action; override at `docker run` for lint, a subset, etc.
CMD ["npm", "test"]