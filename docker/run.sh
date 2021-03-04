cleanup() {
    echo "Cleaning up... Don't forcefully exit"
    echo "All clear! Exit"
    exit
}

trap cleanup SIGINT
trap cleanup SIGTERM
trap cleanup KILL

mongod --dbpath=/var/lib/mongodb --port 8094 --bind_ip 0.0.0.0 --auth --logpath=/var/log/mongodb/mongodb.log --fork

cd /home/carla/ADTest_backend

echo "Launching ADTest_backend."
node app.js &
sleep 5
echo "ADTest_backend launched."
sleep infinity
