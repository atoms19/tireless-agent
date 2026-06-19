FROM node:24-bookworm



RUN apt-get update && apt-get install -y \
    ripgrep \
    fzf \
	 npm \
    git \
    wget \
    gcc \
    g++ \
    make \
    python3 \
    python3-pip \
    neovim \
    curl \
    jq

COPY apply_patch.py /usr/local/bin/apply_patch
RUN chmod +x /usr/local/bin/apply_patch


WORKDIR /app
