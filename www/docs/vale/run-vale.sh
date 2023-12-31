#!/bin/bash

list=""
prefix="www/docs/"
alertLevel=$1

if [ ${#alertLevel} -eq 0 ]; then
  alertLevel="suggestion"
fi

# get directories in content other than reference
for i in `find ../content -type d -maxdepth 1 -not -path '../content/references' -not -path '../content'`
do
  if [ ${#list} -gt 0 ]; then
    list+=' '
  fi
  list+="$prefix${i#../}"
done
#get files in content (not nested)
for i in `find ../content -type f -maxdepth 1 -not -path '../content/references'`
do
  if [ ${#list} -gt 0 ]; then
    list+=' '
  fi
  list+="$prefix${i#../}"
done

# echo $list
cd ../../..
exec vale $list --minAlertLevel $alertLevel