#!/bin/zsh

export MONGO_URI="mongodb+srv://kuranasaki:eZVZ1iRkAzYJskMp@cluster0.dksupcd.mongodb.net/"
export NEXT_PUBLIC_SOCKET_ENDPOINT=$(ifconfig en0 | grep 'inet ' | awk '{print $2}'):3005

# # For deployed environment
# export NEXT_PUBLIC_SOCKET_ENDPOINT="https://cp-network-chat-socket.thegoose.work"

export NEXT_PUBLIC_ATLAS_APP_ID="application-0-ahdtpog"
export NEXT_PUBLIC_ATLAS_API_KEY="ewtZ3PaQTC1eyah0QfmIlGhZt5dwWQzbzPKEVMzJjbGOH6cLBIIjqLoCXQvYdIdH"

docker compose build
docker-compose up