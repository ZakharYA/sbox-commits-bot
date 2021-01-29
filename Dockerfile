FROM node:14-alpine

RUN mkdir /home/node/app/ && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node . ./

USER node

RUN npm install && npm cache clean --force --loglevel=error

CMD ["npm", "start"]
