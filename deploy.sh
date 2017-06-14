#!/bin/sh

#GOOS="linux" go build

SERVER_PORT="2277"
SERVER_USER="www-user"
SERVER_IP="95.213.237.88"
PATH_ON_SERVER="/var/www-src/demostage.ru/gamejam"

tar cf www.tar www

scp -P $SERVER_PORT ./gamejam $SERVER_USER@$SERVER_IP:$PATH_ON_SERVER/tmp_gamejam
scp -P $SERVER_PORT ./www.tar $SERVER_USER@$SERVER_IP:$PATH_ON_SERVER/www.tar
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "cd $PATH_ON_SERVER; killall gamejam; rm -rf ./www; tar xf www.tar; rm ./www.tar; rm ./gamejam; mv ./tmp_gamejam ./gamejam; chmod +x ./gamejam; nohup ./gamejam > /dev/null 2>&1 &"

rm www.tar