# Nest-DDB boilerplate

Nest app boilerplate for CDK development with AWS DDB, AWS Lambda. (forked from Nest-CDK)

## Environment

- MacOS Monterey 12.4
- Node 18.12.1 (LTS)

## Commands

- `build`: bundle nest app
- `start`: start nest app for local development
- `cdk`: run cdk diff | synth | deploy
- `get-lambda`: get lambda endpoint
- `migrate-dev`: create schema on local database(defined in dynamodb-local-schema)

## Requirements

- you need `aws-cli@^1.27.40` and `jq@1.6` installed.
- you need `docker@20.10.21` and `docker-compose@2.14.2`
- aws configuration with named profile ([how to configure aws profile via cli](https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/cli-configure-profiles.html))
- cdk bootstraped ([how to bootstrapping for cdk development](https://docs.aws.amazon.com/ko_kr/cdk/v2/guide/bootstrapping.html))
- make environment files named `env/.env.secrets`. All required keys are defined on env/required.json.
