FROM ubuntu:18.04

RUN useradd -ms /bin/bash carla

USER root

# non-interactive setting for tzdata
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
  apt-get install -y git curl wget mongodb tcptraceroute bc net-tools

# install nodejs 12.x
RUN curl -sL https://deb.nodesource.com/setup_12.x |  bash - && \
  apt-get install -y nodejs && \
  npm install -g npm

RUN mkdir /root/.ssh/

ADD id_rsa /root/.ssh/id_rsa

RUN chmod 600 /root/.ssh/* && \
  touch /root/.ssh/known_hosts && \
  ssh-keyscan codeup.aliyun.com >> /root/.ssh/known_hosts

RUN cd /home/carla/ && \
  git clone git@codeup.aliyun.com:5f3f374f6207a1a8b17f933f/ADTest/ADTest_backend.git && \
  chmod 777 /home/carla/ADTest_backend && \
  cd /home/carla/ADTest_backend/ && \
  npm config set registry 'https://registry.npm.taobao.org' && \
  npm config get registry && \
  npm install

EXPOSE 8090-8094

COPY run.sh /home/carla/
WORKDIR /home/carla

CMD ["./run.sh"]

ENTRYPOINT ["/bin/bash", "-c"]
