# app name should be overridden.
# ex) production-stage: make build APP_NAME=<APP_NAME>
# ex) development-stage: make build-dev APP_NAME=<APP_NAME>

APP_NAME = nodebase
APP_NAME := $(APP_NAME)

.PHONY: build
# Build the container image - Development
build-dev:
	docker build -t ${APP_NAME}\
		--target development-build\
		-f Dockerfile .

# Build the container image - Production
build:
	docker build -t ${APP_NAME}\
		--target production-build\
		-f Dockerfile .

# Clean the container image
clean:
	docker rmi -f ${APP_NAME}

# Run the container image
run:
	docker run -it -p 3003:3000 ${APP_NAME}

all: build