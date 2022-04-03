# Loopbase

> ⚠️ THIS APP IS STILL IN ALPHA: You may encounter bugs, some features are missing or subject to change.

With loopbase, you can browse samples on Looperman and download them. Just search for whatever you need, save samples, and drag them into your DAW from the app! Loopbase is not affiliated with Looperman.

![Screenshot](https://user-images.githubusercontent.com/68156346/161435777-439a4893-a842-425e-b7cc-249d031e4503.png)

## Installing

If you're looking for something more stable, head over to the [releases section](https://github.com/StarburstAudio/loopbase/releases) and grab the latest one for your platform.

If you want to have something more new, you can build from source

## Building

If you want to build Loopbase yourself, you'll need to have git, npm, and node.js installed.

1. Clone the repository

```sh
git clone https://github.com/StarburstAudio/loopbase
```

2. Then, install the dependencies

```sh
npm i
```

3. Now, decide whether you want to **build** or **run**

```sh
npm run electron:serve  # Runs the app with hot-reload
npm run electron:build  # Compiles the app to an executable
```

If you run into an error, try running `nvm use 16` and then re-doing step 3.
