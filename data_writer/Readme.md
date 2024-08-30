# Running Serverless with a Custom Configuration File
- GCP
npx serverless deploy  --config serverless-gcp.yml






- AWS

export AWS_ACCESS_KEY_ID= 
export AWS_SECRET_ACCESS_KEY= 

npx serverless deploy --config serverless-aws.yml
npx serverless invoke local --function processWriteAWS --path sns-event.json --config serverless-aws.yml