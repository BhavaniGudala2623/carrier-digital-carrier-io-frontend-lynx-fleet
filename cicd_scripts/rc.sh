#!/bin/sh

# stop execution when an error is encountered

set -e


# configure environment

export AWS_DEFAULT_REGION=us-east-1


# ensure we've got valid AWS credentials before proceeding

# aws sts get-caller-identity


# login into CodeArtifact repo

# we don't want to use the command as-is because it modifies user copy of `.npmrc`, which we will avoid

# We login multiple times so we can keep all carrierio code separate from public files
NPM_LOGIN_DRY_RUN=`aws codeartifact login --tool npm --repository npm-store --domain carrier --domain-owner 652821702517 --dry-run`
NPM_LOGIN_CARRIERIO_DRY_RUN=`aws codeartifact login --tool npm --repository carrier-io --domain carrier --domain-owner 652821702517 --dry-run`
NPM_LOGIN_CARRIER_DRY_RUN=`aws codeartifact login --tool npm --repository carrier --domain carrier --domain-owner 652821702517 --dry-run`

# shellcheck disable=SC2016

TRANSFORM_DRY_RUN_TO_NPMRC='
BEGIN {
  print "# generated file; do not edit directly";
}

$4~/registry/ || $5~/true/ || $4~/_authToken$/ {
  print $4 "=" $5;
}
'

TRANSFORM_CARRIERIO_DRY_RUN_TO_NPMRC='
BEGIN {
  print "# generated file for Carrier-IO; do not edit directly";
}
$4~/registry/ {
  print "@carrier-io:" $4 "=" $5;
}

$5~/true/ || $4~/_authToken$/ {
  print $4 "=" $5;
}
'

TRANSFORM_CARRIER_DRY_RUN_TO_NPMRC='
BEGIN {
  print "# generated file for Carrier-IO; do not edit directly";
}
$4~/registry/ {
  print "@carrier:" $4 "=" $5;
}

$5~/true/ || $4~/_authToken$/ {
  print $4 "=" $5;
}
'


# overwrite & set the contents of placeholder `.npmrc`

echo "${NPM_LOGIN_DRY_RUN}" | awk "${TRANSFORM_DRY_RUN_TO_NPMRC}" > .npmrc
echo "${NPM_LOGIN_CARRIERIO_DRY_RUN}" | awk "${TRANSFORM_CARRIERIO_DRY_RUN_TO_NPMRC}" >> .npmrc
echo "${NPM_LOGIN_CARRIER_DRY_RUN}" | awk "${TRANSFORM_CARRIER_DRY_RUN_TO_NPMRC}" >> .npmrc

# shellcheck disable=SC2016

TRANSFORM_DRY_RUN_TO_YARNRC='
BEGIN {
  print "# generated file; do not edit directly";
}

$4~/registry/ {
  print $4 " \"" $5 "\"";
}
'

TRANSFORM_CARRIERIO_DRY_RUN_TO_YARNRC='
$4~/registry/ {
  print "\"" "@carrier-io:" $4 "\" \"" $5 "\"";
}
'

TRANSFORM_CARRIER_DRY_RUN_TO_YARNRC='
$4~/registry/ {
  print "\"" "@carrier:" $4 "\" \"" $5 "\"";
}
'

# overwrite & set the contents of placeholder `.yarnrc`

echo "${NPM_LOGIN_DRY_RUN}" | awk "${TRANSFORM_DRY_RUN_TO_YARNRC}" > .yarnrc
echo "${NPM_LOGIN_CARRIERIO_DRY_RUN}" | awk "${TRANSFORM_CARRIERIO_DRY_RUN_TO_YARNRC}" >> .yarnrc
echo "${NPM_LOGIN_CARRIER_DRY_RUN}" | awk "${TRANSFORM_CARRIER_DRY_RUN_TO_YARNRC}" >> .yarnrc
