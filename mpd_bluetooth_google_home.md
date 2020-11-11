https://gist.github.com/actuino/9548329d1bba6663a63886067af5e4cb

sudo apt-get install pulseaudio pulseaudio-module-bluetooth

sudo usermod -G bluetooth -a pi

pulseaudio --start

bluetoothctl

scan on
pair 54:60:09:6F:13:4B
scan off

bluetoothctl -- connect 54:60:09:6F:13:4B

speaker-test -c 2

edit /etc/pulse/default.pa , add
load-module module-switch-on-connect
load-module module-native-protocol-tcp auth-ip-acl=127.0.0.1


sudo apt-get install mpd mpc
sudo adduser mpd pulse
sudo adduser mpd pulse-access

edit /etc/mpd.conf
bind_to_address         "/run/mpd/socket"
#comment out alsa
audio_output {
        type            "pulse"
        name            "My Pulse Output"
        server          "127.0.0.1"             # optional
#       sink            "remote_server_sink"    # optional
}

edit /etc/dbus-1/system.d/bluetooth.conf ?
<policy user="pi">
   <allow send_destination="org.bluez"/>
   <allow send_interface="org.bluez.Agent1"/>
   <allow send_interface="org.bluez.MediaEndpoint1"/>
   <allow send_interface="org.bluez.MediaPlayer1"/>
   <allow send_interface="org.bluez.GattCharacteristic1"/>
   <allow send_interface="org.bluez.GattDescriptor1"/>
   <allow send_interface="org.freedesktop.DBus.ObjectManager"/>
   <allow send_interface="org.freedesktop.DBus.Properties"/>
 </policy>

echo -e "connect 54:60:09:6F:13:4B\nquit\n" | bluetoothctl
echo -e "disconnect 54:60:09:6F:13:4B\nquit\n" | bluetoothctl

 mpc add http://radionova.ice.infomaniak.ch/radionova-high.mp3
 pmc add https://stream.radiofrance.fr/fip/fip.m3u8?id=radiofrance
 mpc play
