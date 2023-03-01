#!make
# The .env file
env-file := .env

include $(env-file)

# The default project to be assigned to the running compose service containers
project ?= support-center

# The service name option
service ?=

# The default options value when running a target
options ?=

# The default command to execute when spawning up a container
cmd ?= sh

# Ensure that the docker-command to be used with the compose file is set before a target is invoked
docker-cmd := docker-compose -p $(project) -f ./docker/docker-compose.yml

# Ensure that make invocation is not run sequentially
.NOTPARALLEL:

.DEFAULT_GOAL := help

help:
	@echo ''
	@echo 'Usage: make [TARGET] [EXTRA_ARGUMENTS]'
	@echo 'Targets:'
	@echo '  build 																	                build docker image for the application'
	@echo '  run                                                                                    run all the containers'
	@echo '  stop [OPTIONAL:service=[SERVICE_NAME]] [OPTIONAL:options=[OPTIONS]]                    stop all running containers'
	@echo '  shell service=[SERVICE_NAME] [OPTIONAL:options=[OPTIONS]] [OPTIONAL:cmd=[COMMAND]]     spawn a temporary container for the service to run a command'
	@echo '  logs [OPTIONAL:service=[SERVICE_NAME]] [OPTIONAL:options=[OPTIONS]]                    view outputs from the containers'
	@echo '  clean [OPTIONAL:options=[OPTIONS]]                                                     remove all the docker images and containers for the application'
	@echo '  stats                                                                                  show system statistics from all the running containers'
	@echo '  install                                                                                fresh installation for the application to run'
	@echo '  docker compose-command=[DOCKER_COMPOSE_COMMAND_AND_OPTIONS]                            run a docker-compose command for the project'
	@echo '  analyze                                                                                analyze the application code'
	@echo ''

.PHONY: build .build-service
build:
	@make .build-service

.build-service:
	$(docker-cmd) build --force-rm --compress $(options)

.PHONY: run .run-service
run:
	@make .run-service

.run-service:
	$(docker-cmd) up -d --no-build

.PHONY: stop
stop:
	$(docker-cmd) stop $(options) $(service)
.PHONY: shell
shell:
ifeq ("$(service)","")
	@echo ''
	@echo 'Missing parameter: [SERVICE_NAME]'
	@echo ''
	@echo 'Usage: make shell service=[SERVICE_NAME] [OPTIONAL:options=[OPTIONS]] [OPTIONAL:cmd=[COMMAND]]'
	@echo ''
else
	$(docker-cmd) run --rm $(options) $(service) $(cmd)
endif

.PHONY: logs
logs:
	$(docker-cmd) logs --follow --timestamps $(options) $(service)

.PHONY: clean
clean:
	$(docker-cmd) down --remove-orphans $(options)
	rm -rf node_modules/
	find dist/ -not -samefile 'dist/.gitignore' -not -path dist/ -exec rm -rf {} +
	rm -f package-lock.json

.PHONY: stats
stats:
	$(docker-cmd) ps -q | xargs docker stats

.PHONY: install
install:
	make build
	@make shell service=node cmd="npm i"

.PHONY: docker
docker:
ifeq ("$(compose-command)","")
	@echo ''
	@echo 'Missing parameter: [DOCKER_COMPOSE_COMMAND_AND_OPTIONS]'
	@echo ''
	@echo 'Usage: make docker compose-command=[DOCKER_COMPOSE_COMMAND_AND_OPTIONS]'
	@echo ''
else
	$(docker-cmd) $(compose-command)
endif

.PHONY: analyze
analyze:
	make shell service=node cmd="npm run lint"
