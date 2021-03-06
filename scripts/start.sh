#!/usr/bin/env bash

R="\e[1;31m"
RB="\e[1;2;30;41m"
G="\e[1;32m"
GB="\e[1;2;30;42m"
Y="\e[1;33m"
YB="\e[1;2;30;43m"
W="\e[0m"
D="\e[1;2m"
DT="\e[2m"
L="\e[1;39m"
S="\e[1;2;30;100m"
B="\e[1;30m"

SCRIPTPATH="$(dirname "$(readlink -f "$0")")"
PIDPATH="$SCRIPTPATH/.running.lck"


# Presentational

clear
echo -e $L"Tracker Backend"$W
echo -e $DT"Starts up the tracker backend systems, ready for use."
echo -e $B"--------------------------------------------"$W
echo ""


# Drop running services
if [ -e $PIDPATH ]; then
  RUNNING_PID=`cat $PIDPATH`
  if [ ! -z RUNNING_PID ]; then

    pushd $SCRIPTPATH/../docker > /dev/null
    echo -e $L"Stopping already running docker services"$W
    echo -e $B"--------------------------------------------"$W
    docker-compose down
    echo
    popd > /dev/null

    echo -e $L"Stopping already running graphql service"$W
    echo -e $B"--------------------------------------------"$W
    kill $RUNNING_PID
    rm $PIDPATH
    echo

  fi
fi

# Start services
pushd $SCRIPTPATH/../docker > /dev/null
echo -e $L"Starting docker services"$W
echo -e $B"--------------------------------------------"$W
docker-compose up -d
echo
popd > /dev/null

pushd $SCRIPTPATH/.. > /dev/null
echo -e $L"Installing missing packages"$W
echo -e $B"--------------------------------------------"$W
yarn install
echo

echo -e $L"Starting graphql service"$W
echo -e $B"--------------------------------------------"$W
yarn start &
echo
popd > /dev/null


echo $! > $PIDPATH
