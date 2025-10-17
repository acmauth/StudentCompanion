# -------- Stage 1: Build --------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the production-ready files
RUN npm run build


# -------- Stage 2: Run --------
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only what's needed to serve the built app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/build ./build

# Install only production dependencies
RUN npm install --omit=dev

# Set environment variables (configurable)
ENV HOST=0.0.0.0
ENV PORT=8080

# Expose the configured port
EXPOSE ${PORT}

# Run the Vite preview server with host/port support
CMD ["sh", "-c", "npm run preview -- --host ${HOST} --port ${PORT}"]
