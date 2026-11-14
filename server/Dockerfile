FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN mkdir -p logs && chown -R node:node /app
USER node
# 5002 = REST API, 8080 = WebSocket notifications
EXPOSE 5002 8080
CMD ["node", "app.js"]
