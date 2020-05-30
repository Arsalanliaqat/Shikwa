FROM trufflesuite/ganache-cli:latest

COPY ganache.sh /app/

RUN /bin/sh -c "apk add --no-cache bash"
ENTRYPOINT bash ganache.sh