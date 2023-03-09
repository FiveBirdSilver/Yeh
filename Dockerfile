FROM node:alpine as builder

COPY package*.json ./

COPY . .

FROM nginx:alpine
EXPOSE 3000

RUN pwd

COPY /default.conf /etc/nginx/conf.d/default.conf

RUN pwd
COPY --from=builder /out /usr/share/nginx/html

# COPY --from=0 /usr/src/app/.next /usr/share/nginx/html

# CMD ["nginx", "-g", "daemon off;"]



# FROM node:14-alpine as build-stage

# WORKDIR /app
# COPY package*.json ./
# RUN npm install

# COPY . .
# RUN npm run build

# FROM nginx:alpine
# COPY --from=build-stage /app/out /usr/share/nginx/html
# COPY ./default.conf /etc/nginx/conf.d/default.conf
# EXPOSE 3000
