DIR=$(shell pwd)
STACK=plannedpooling

create:
	aws cloudformation create-stack --stack-name $(STACK) --template-body file:///$(DIR)/cloudformation.yaml

update:
	aws cloudformation update-stack --stack-name $(STACK) --template-body file:///$(DIR)/cloudformation.yaml

.build:
	npm run build

upload: .build
	$(eval BUCKET := $(shell aws cloudformation describe-stacks --stack-name $(STACK) --query "Stacks[].Outputs[?OutputKey=='BucketName'][].OutputValue" --output text))
	aws s3 sync build/ s3://$(BUCKET)

info:
	aws cloudformation describe-stacks --stack-name $(STACK) --query "Stacks[].Outputs" --output text
