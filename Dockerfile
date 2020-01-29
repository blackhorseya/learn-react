FROM node:alpine as builder

WORKDIR /app
COPY package.json /app/
RUN yarn install
COPY ./ /app/
RUN yarn build

FROM nginx:alpine
COPY --from=builder /app/build/ /usr/share/nginx/html
RUN chown nginx.nginx /usr/share/nginx/html/ -R