FROM node:10.19.0
WORKDIR /Kafka1
COPY  / ./
RUN npm install 
EXPOSE 80
CMD ["npm","run","dev"]