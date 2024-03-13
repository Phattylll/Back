FROM node:18-alpine As deps
RUN apk update && apk add --no-cache tzdata
RUN apk add g++ make py3-pip

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build
RUN apk update && apk add --no-cache tzdata
RUN apk add g++ make py3-pip

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=deps /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN npm run build

USER node

###################
# PRODUCTION
###################

FROM node:18-alpine As production
RUN apk update && apk add --no-cache tzdata
WORKDIR /usr/src/app

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/asset ./asset

# Start the server using the production build
CMD [ "node", "dist/main.js" ]