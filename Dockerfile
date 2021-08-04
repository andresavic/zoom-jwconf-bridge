FROM selenium/standalone-chrome:4.0.0-rc-1-prerelease-20210713
USER root

ARG vnc_password=secret
RUN x11vnc -storepasswd ${vnc_password} /home/seluser/.vnc/passwd

# Install pulse audio
RUN apt-get -qq update && apt-get install -qy curl gnupg iceweasel sudo desktop-file-utils lib32z1 \
  libx11-6 libegl1-mesa libxcb-shm0 \
  libglib2.0-0 libgl1-mesa-glx libxrender1 libxcomposite1 libxslt1.1 \
  libgstreamer1.0-0 libgstreamer-plugins-base1.0-0 libxi6 libsm6 \
  libfontconfig1 libpulse0 libsqlite3-0 \
  libxcb-shape0 libxcb-xfixes0 libxcb-randr0 libxcb-image0 \
  libxcb-keysyms1 libxcb-xtest0 ibus ibus-gtk \
  libnss3 libxss1 xcompmgr pulseaudio qt5-default xdg-utils

ARG ZOOM_URL=https://zoom.us/client/latest/zoom_amd64.deb

# Grab the client .deb
# Install the client .deb
# Cleanup
RUN curl -sSL $ZOOM_URL -o /tmp/zoom_setup.deb
RUN dpkg -i /tmp/zoom_setup.deb
RUN apt-get -f install

RUN adduser root pulse-access

# Install NODEJS
RUN curl -sL https://deb.nodesource.com/setup_14.x  | bash -
RUN apt-get -y install nodejs

# Install Webinterface

WORKDIR /usr/src/app
COPY ./app .
RUN npm install
RUN npm run build

# Use custom entrypoint
WORKDIR /
COPY entrypoint.sh /opt/bin/entrypoint.sh
RUN chmod 777 /opt/bin/entrypoint.sh

ENTRYPOINT ["/bin/sh", "/opt/bin/entrypoint.sh"]