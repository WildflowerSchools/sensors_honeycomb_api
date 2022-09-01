FROM postgres:12

#ENV PG_PARTMAN_VERSION 4.4.1
#
#RUN apt-get update && \
#    apt-get install unzip && \
#    apt-get --assume-yes install build-essential && \
#    apt-get --assume-yes install postgresql-server-dev-12 && \
#    apt-get --assume-yes install postgresql-12-cron && \
#    apt-get install -y wget && \
#    wget https://github.com/pgpartman/pg_partman/archive/v${PG_PARTMAN_VERSION}.zip -O ${PG_PARTMAN_VERSION}.zip && \
#    unzip ${PG_PARTMAN_VERSION}.zip && \
#    cd /pg_partman-${PG_PARTMAN_VERSION} && pwd && make install && make NO_BGW=1 install

COPY build/local/postgres/002-config-conf.sh /docker-entrypoint-initdb.d/
COPY build/local/postgres/003-create-extensions.sql /docker-entrypoint-initdb.d/
