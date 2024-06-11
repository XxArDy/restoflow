FROM node:21

WORKDIR /src

COPY package*.json ./

RUN npm install -g @angular/cli@17.3.1

RUN npm install

COPY . .

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--disable-host-check"]
