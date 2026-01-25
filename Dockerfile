FROM ruby:slim

# Fix for permission issues with Jekyll cache
ARG GROUPID=1000
ARG GROUPNAME=adeleo
ARG USERID=1000
ARG USERNAME=adeleo

ENV DEBIAN_FRONTEND noninteractive

LABEL authors="Amir Pourmand,George Araújo" \
      description="Docker image for al-folio academic template" \
      maintainer="Amir Pourmand"

# Add a non-root user to the image with a specific group and user id to avoid permission issues
RUN groupadd -r $GROUPNAME -g $GROUPID && \
    useradd -u $USERID -m -g $GROUPNAME $USERNAME

# install system dependencies
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends \
        build-essential \
        curl \
        git \
        imagemagick \
        inotify-tools \
        libyaml-dev \
        locales \
        nodejs \
        procps \
        python3-pip \
        zlib1g-dev && \
    pip --no-cache-dir install --upgrade --break-system-packages nbconvert

# clean up
RUN apt-get clean && \
    apt-get autoremove && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*  /tmp/*

# set the locale
RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && \
    locale-gen

# set environment variables
ENV EXECJS_RUNTIME=Node \
    JEKYLL_ENV=production \
    LANG=en_US.UTF-8 \
    LANGUAGE=en_US:en \
    LC_ALL=en_US.UTF-8

# create a directory for the jekyll site
RUN mkdir /srv/jekyll

# copy the Gemfile and Gemfile.lock to the image
ADD Gemfile.lock /srv/jekyll
ADD Gemfile /srv/jekyll

# set the working directory
WORKDIR /srv/jekyll

# install jekyll and dependencies
RUN gem install --no-document jekyll bundler
RUN bundle install --no-cache

EXPOSE 8080

COPY bin/entry_point.sh /tmp/entry_point.sh

# Set the ownership of the jekyll site directory to the non-root user
USER $USERNAME

CMD ["/tmp/entry_point.sh"]
