set -e

cd ../crawler
node bilbokokonpartsak.js > ../data/events_raw2.txt
cd ../data-manipulation
node non-konparsa-events.js >> ../data/events_raw2.txt
node difference.js > result.txt
