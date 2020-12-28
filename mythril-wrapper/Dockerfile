FROM ubuntu
ENV TZ=Europe/Tallinn
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt update && apt upgrade -y && apt install openssl libssl-dev git python3-pip nodejs -y
RUN apt install npm -y && apt clean
RUN pip3 install mythril
WORKDIR app
COPY . .
RUN rm -rf node_modules && npm install
ENTRYPOINT ["node"]
CMD ["app.js"]
