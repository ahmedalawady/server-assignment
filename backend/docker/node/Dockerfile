FROM node:16-alpine

# Set Environment Variables
ENV DEBIAN_FRONTEND noninteractive

# Set Timezone
ARG TZ=UTC
ENV TZ ${TZ}
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Install all application dependencies
RUN apk add --no-cache bash \
	&& rm -rf /var/cache/apk/*

ARG NPM_TOKEN
ENV USER=node
ENV APP_DIR=/var/www

WORKDIR ${APP_DIR}
CMD ["/bin/bash"]

USER ${USER}

# Autocomplete for NPM
# https://docs.npmjs.com/cli-commands/completion.html
RUN npm completion >> ~/.bashrc
