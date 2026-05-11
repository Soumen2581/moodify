# --- 1. Build the React client ---
FROM node:20-alpine AS client
WORKDIR /client
COPY client/package.json client/package-lock.json* ./
RUN npm ci --no-audit --no-fund
COPY client/ ./
RUN npm run build

# --- 2. Install server production deps ---
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# --- 3. Final runtime image ---
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps  --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json package-lock.json ./
COPY --chown=node:node src ./src
COPY --from=client --chown=node:node /client/dist ./client/dist
USER node
EXPOSE 3000
CMD ["node", "src/server.js"]
