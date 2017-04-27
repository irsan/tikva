FROM node:boron

ENV DEBIAN_FRONTEND noninteractive

# make sure apt is up to date
RUN apt-get update && apt-get upgrade -y

# install curl
RUN apt-get install -y git openssh-client build-essential

RUN echo "Asia/Singapore" | tee /etc/timezone
RUN dpkg-reconfigure --frontend noninteractive tzdata

RUN ["npm", "install", "grunt-cli", "-g"]
RUN ["npm", "install", "bunyan", "-g"]

#use host id_rsa
RUN mkdir /root/.ssh
RUN chmod 700 /root/.ssh
COPY /root/.ssh/id_rsa /root/.ssh/id_rsa
RUN chmod 600 /root/.ssh/id_rsa

#start script
COPY start.sh /root/start.sh
RUN chmod a+x /root/start.sh

CMD /root/start.sh