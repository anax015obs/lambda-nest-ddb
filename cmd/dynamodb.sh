#!/bin/bash
source cmd/load-env.sh aws
source cmd/load-env.sh local
source cmd/load-env.sh secrets

if [[ "$1" =~ ^deploy$ ]]; then
  aws dynamodb create-table --cli-input-json file://dynamodb-local-schema.json --endpoint-url http://localhost:$DB_PORT --profile $AWS_PROFILE --table-name $CDK_STACK_NAME-table
elif [[ "$1" =~ ^start$ ]]; then
  export TABLE_NAME=$CDK_STACK_NAME-table
  if [[ $(docker ps -q -f name=$CDK_STACK_NAME-dynamodb) ]]; then
    echo "all containers are running"
    nest start -w --entryFile index.local  
  else
    docker-compose up -d
    nest start -w --entryFile index.local  
  fi
else 
  exit 1
fi

