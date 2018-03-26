cd ..

pushd docker
docker-compose up -d
popd

node_modules/.bin/babel src -d dist

pushd dist
node index.js &
