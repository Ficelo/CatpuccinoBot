FROM node:20-slim

RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    xdg-utils \
    unzip \
    chromium \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY ./images ./images
COPY ./hats ./hats

COPY package*.json ./
RUN npm ci --include=optional

COPY . .

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

ENV PORT=3000
EXPOSE 3000

RUN if [ -d node_modules/sharp ]; then \
      npm rebuild sharp --update-binary || true ; \
    fi

CMD ["node", "api.js"]
