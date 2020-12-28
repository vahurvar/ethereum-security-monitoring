FROM ubuntu
ENV TZ=Europe/Tallinn
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt update && apt upgrade -y && apt install git nodejs npm -y && apt clean
WORKDIR app
COPY . .
RUN rm -rf node_modules && npm install
ENTRYPOINT ["node"]
CMD ["app.js"]
