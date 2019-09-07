FROM node:9-slim
WORKDIR /
COPY package.json /
RUN npm install
COPY . /
CMD ["npm", "start"]