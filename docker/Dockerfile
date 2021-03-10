FROM ubuntu:18.04

RUN useradd -ms /bin/bash sdg

USER root

# non-interactive setting for tzdata
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
  apt-get install -y git curl wget mongodb tcptraceroute bc net-tools

# install nodejs 12.x
RUN curl -sL https://deb.nodesource.com/setup_12.x |  bash - && \
  apt-get install -y nodejs && \
  npm install -g npm

# clone source code
RUN cd /home/sdg/ && \
  git clone git://github.com/SelfDriveGuard/sdg-backend.git && \
  chmod 777 /home/sdg/sdg-backend && \
  cd /home/sdg/sdg-backend/ && \
  npm install

EXPOSE 8092-8094

COPY run.sh /home/sdg/
WORKDIR /home/sdg

CMD ["./run.sh"]

ENTRYPOINT ["/bin/bash", "-c"]
