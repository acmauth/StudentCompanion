FROM node:26-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY . .

# Install dependencies
RUN npm install

# Build the production-ready files
RUN npm run build

# Set environment variables (configurable)
ENV HOST=0.0.0.0
ENV PORT=8080

# Expose the configured port
EXPOSE ${PORT}

# Run the Vite preview server with host/port support
CMD ["sh", "-c", "npm run preview -- --host ${HOST} --port ${PORT}"]
