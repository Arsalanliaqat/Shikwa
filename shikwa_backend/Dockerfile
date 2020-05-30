FROM node

# Install Truffle
RUN npm install -g truffle
RUN npm config set bin-links false

# Move Contract Files
COPY contracts ./contracts
COPY migrations ./migrations
COPY truffle-config.js ./truffle-config.js

# Move Source Files
COPY backend/src ./backend/src
COPY backend/package.json ./backend/package.json
COPY backend/package-lock.json ./backend/package-lock.json

# Clean Install NPM Dependencies
RUN cd backend && npm ci




