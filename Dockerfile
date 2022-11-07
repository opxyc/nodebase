# Common build stage
FROM node:18.12.0 as common-build

WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
EXPOSE 3000

# Development build stage
FROM common-build as development-build
ENV NODE_ENV development
CMD npm run migrate && npm run seed && npm run dev

# Production build stage
FROM common-build as production-build
ENV NODE_ENV production
CMD npm run migrate && npm run seed && npm run start