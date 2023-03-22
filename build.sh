cd ./web
npm ci
npm run build
cd ..
rm -rf ./bin
npm ci
npm run build
mkdir ./bin/web
cp -r ./web/dist ./bin/web/dist
rm ./bin/web/dist/awesome.mp4