---
layout: default
title: {{ site.name }}
---
# Mac定时node脚本
## 定时
其实就是用launchctl来做定时。在/Users/pyf/Library/LaunchAgents里面新建一个自己的文件，我取名为了com.pyf.bookMeeting.plist。

```java
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.pyf.bookMeeting</string>
  <key>ProgramArguments</key>
  <array>
    <string>/Users/pyf/code/panyifei/launchctl/run.sh</string>
  </array>
  <key>StartCalendarInterval</key>
  <dict>
        <key>Minute</key>
        <integer>31</integer>
        <key>Hour</key>
        <integer>17</integer>
  </dict>
  <key>StandardOutPath</key>
<string>/Users/pyf/code/panyifei/launchctl/abc.log</string>
<key>StandardErrorPath</key>
<string>/Users/pyf/code/panyifei/launchctl/abcerror.log</string>
</dict>
</plist>
```

上面的这段代码就是设置定时
