#!/bin/sh
echo 'Starting...'

# Load pulseaudio virtual audio source
rm -rf /var/run/pulse /var/lib/pulse /root/.config/pulse
pulseaudio -D --verbose --exit-idle-time=-1 --system --disallow-exit

# Create a virtual audio source; fixed by adding source master and format
echo "Creating virtual audio source: ";
pactl load-module module-virtual-source master=auto_null.monitor format=s16le source_name=VirtualMic

# Set VirtualMic as default input source;
echo "Setting default source: ";
pactl set-default-source VirtualMic

# Start Webinterface & Selenium-Chrome-Standalone
npm start --prefix /usr/src/app & /opt/bin/entry_point.sh