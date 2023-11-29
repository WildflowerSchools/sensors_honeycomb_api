FROM python:3.8.18-alpine


RUN apk update && \
    apk add --no-cache --update \
    python3 \
    python3-dev \
    py3-pip \
    build-base

RUN apk add --virtual build-deps gcc python3-dev musl-dev && \
    apk add --no-cache --update postgresql-dev postgresql-client && \
    pip install psycopg2


RUN mkdir /scripts

COPY ./*.py /scripts/
COPY ./*.sql /scripts/
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod 777 /entrypoint.sh

ENTRYPOINT ["sh", "/entrypoint.sh"]
