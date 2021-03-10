cleanup() {
    echo "Cleaning up... Don't forcefully exit"
    echo "All clear! Exit"
    exit
}

trap cleanup SIGINT
trap cleanup SIGTERM
trap cleanup KILL

mongod --dbpath=/var/lib/mongodb --port 8094 --bind_ip 0.0.0.0 --logpath=/var/log/mongodb/mongodb.log --fork && \
mongo admin --port 8094 --eval "db.createUser({ user:'sdg',pwd:'123456',roles:[ { role:'readWriteAnyDatabase', db: 'admin'}]})"
mongod --shutdown --dbpath /var/lib/mongodb
mongod --dbpath=/var/lib/mongodb --port 8094 --bind_ip 0.0.0.0 --auth --logpath=/var/log/mongodb/mongodb.log --fork

cd /home/sdg/sdg-backend

echo "Launching sdg-backend."
node app.js &
sleep 5
echo "sdg-backend launched."
sleep infinity
