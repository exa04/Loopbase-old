# Looperman-Desktop

A third-party electron desktop client for Looperman.

![Screenshot](https://i.imgur.com/Z7Q9scj.png)

> :warning: **WARNING: DO NOT DOWNLOAD THIS APP YET!**
> You should wait for the first stable release if you are a regular user.

## Installing

With the release of stable version 1.0.0, an installer will be provided for it.
In the meantime, you can check up on progress under the
[projects](https://github.com/stxarixdust/looperman-desktop/projects/1)
section. If you want, feel free to contribute to the issues listed there to speed
up development of this release! If you want to download the bleeding-edge
**unstable** version to contribute to it, do the following:

```sh
git clone https://github.com/stxarixdust/looperman-desktop
npm i
```

You can then run a launch script.

```sh
# You have two options: You can start the app...
npm run start
# ...Or continuously watch its scss files for changes and recompile to css.
# Useful for tasks like UI design: You'll only need to reload from within the app
# Note that non-renderer files (like the main.js entry point) will not update.
npm run start
```

## How to contribute

If you want to tackle an issue that is yet to be assigned, just comment on it and
start a pull request. If you're unsure which one to pick, there are probably some
tagged "help wanted" or "good first issue". Also, the current most relevant ones
can be found in this project: 
[Stable Release 1.0.0](https://github.com/stxarixdust/looperman-desktop/projects/1).
If you find any bugs or otherwise, don't hesitate to file an issue for them, too.