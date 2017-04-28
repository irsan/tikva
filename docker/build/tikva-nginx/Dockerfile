FROM nginx

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && apt-get upgrade -y

COPY tikva.sweethope.com.conf /etc/nginx/conf.d/tikva.sweethope.com.conf

RUN echo "Asia/Singapore" | tee /etc/timezone
RUN dpkg-reconfigure --frontend noninteractive tzdata