set -e

cd ../crawler
node bilbokokonpartsak.js > ../data/events_raw.txt
cd ../data-manipulation
node non-konparsa-events.js >> ../data/events_raw.txt
cat extras.txt >> ../data/events_raw.txt
node sort-events.js > ../data/events_raw_sorted.txt
rm ../data/events_raw.txt
mv ../data/events_raw_sorted.txt ../data/events_raw.txt
