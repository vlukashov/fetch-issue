#!/bin/bash

URL=https://stepzen.stepzen.net/directives.graphql
TIMES=50

for i in $(eval echo "{1..$TIMES}"); do
  echo -n "Run # $i :: "
  curl $URL -m 2 -o /dev/null -s \
    -w 'Return code: %{http_code}; Bytes Received: %{size_download}; Response Time: %{time_total}\n'
done | tee /dev/tty | awk '{ sum+= $NF; n++ } END { if (n > 0) print "Average Response time =",sum / n; }'
