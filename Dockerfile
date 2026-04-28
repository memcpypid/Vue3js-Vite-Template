# ─────────────────────────────────────────
#  Stage 1: Build
# ─────────────────────────────────────────
FROM node:22-alpine AS builder

# Build-time argument (Vite bakes env vars at build time)
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

WORKDIR /app

# Install deps first (layer cache friendly)
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

# Copy source & build
COPY . .
RUN npm run build

# ─────────────────────────────────────────
#  Stage 2: Serve
# ─────────────────────────────────────────
FROM nginx:1.27-alpine AS production

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/app.conf

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
