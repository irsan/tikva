FROM debian

ENV DEBIAN_FRONTEND noninteractive

# make sure apt is up to date
RUN apt-get update && apt-get upgrade -y

# install curl
RUN apt-get install -y curl unzip vim telnet

RUN echo "Asia/Singapore" | tee /etc/timezone
RUN dpkg-reconfigure --frontend noninteractive tzdata

WORKDIR /usr/bin
RUN curl -O https://releases.hashicorp.com/vault/0.7.0/vault_0.7.0_linux_amd64.zip
RUN unzip ./vault_0.7.0_linux_amd64.zip
RUN chmod a+x vault
RUN rm ./vault_0.7.0_linux_amd64.zip

COPY local.json /vault/config/local.json

CMD tail -f /dev/null