FROM luongnguyen/oyente
WORKDIR app
COPY . .
RUN rm -rf node_modules && npm install
ENTRYPOINT ["node"]
CMD ["app.js"]
