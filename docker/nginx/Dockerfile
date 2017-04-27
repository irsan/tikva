FROM nginx

RUN apt-get update && apt-get upgrade

COPY tikva.sweethope.com.conf /etc/nginx/conf.d/tikva.sweethope.com.conf

RUN echo "Asia/Singapore" | tee /etc/timezone
RUN dpkg-reconfigure --frontend noninteractive tzdata