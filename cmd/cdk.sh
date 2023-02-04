#!/bin/bash
case "$1" in
  "diff"|"deploy"|"synth"|"destroy")
    source cmd/load-env.sh aws
    source cmd/load-env.sh production
    source cmd/load-env.sh secrets

    export CDK_ACCOUNT=$(aws sts get-caller-identity --profile $AWS_PROFILE | jq -r .Account)
    export CDK_REGION=$(aws configure get region --profile $AWS_PROFILE)
    
    npm run build
    cdk $1 --profile $AWS_PROFILE
    ;;
  *)
    echo "Validation Error: Argument must be one of diff | deploy | synth" | "destroy"
    exit 1
    ;;
esac

