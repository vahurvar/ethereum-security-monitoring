FROM ubuntu
RUN apt update && apt upgrade -y && apt install git nodejs npm -y && apt clean
WORKDIR app
COPY . .
RUN rm -rf node_modules && npm install
ENTRYPOINT ["node"]
CMD ["app.js"]
