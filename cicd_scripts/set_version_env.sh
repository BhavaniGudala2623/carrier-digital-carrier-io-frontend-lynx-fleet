#! /bin/bash
#
#   SCRIPT SETS BUILD ENV VARIABLES FOR REACT APP
#
#   execute prior to build command

git --version 2>&1 >/dev/null
GIT_IS_AVAILABLE=$?

if [ $GIT_IS_AVAILABLE -eq 0 ]; then
    export REACT_APP_BUILD_NUMBER=$(git rev-parse --short HEAD)
fi

export REACT_APP_BUILD_TIME=$(date +"%s")
export REACT_APP_BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%S%z")
export REACT_APP_VERSION=$(sed -nE 's/^\s*"version": "(.*?)",$/\1/p' package.json)

echo "export REACT_APP_BUILD_NUMBER=$REACT_APP_BUILD_NUMBER" >> $BASH_ENV
echo "export REACT_APP_BUILD_TIME=$REACT_APP_BUILD_TIME" >> $BASH_ENV
echo "export REACT_APP_BUILD_DATE=$REACT_APP_BUILD_DATE" >> $BASH_ENV
echo "export REACT_APP_VERSION=$REACT_APP_VERSION" >> $BASH_ENV
