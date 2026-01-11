# ---------- Build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------- Runtime stage ----------
# Use a maintained Alpine tag and upgrade OS packages to pick up security fixes.
FROM nginxinc/nginx-unprivileged:stable-alpine

# The base image defaults to an unprivileged user, so switch to root only
# for the package upgrade.
USER root
RUN apk --no-cache upgrade
USER nginx

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
