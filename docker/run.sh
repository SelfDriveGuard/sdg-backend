cleanup() {
    echo "Cleaning up... Don't forcefully exit"
    echo "All clear! Exit"
    exit
}

trap cleanup SIGINT
trap cleanup SIGTERM
trap cleanup KILL

cd /home/carla/ADTest_backend

echo "Launching ADTest_backend."
node app.js &
sleep 5

echo "ADTest_backend launched."
sleep infinity
