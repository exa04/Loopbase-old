<p>
  <img src="https://raw.githubusercontent.com/StarburstAudio/loopbase/main/public/icons/png/256x256.png" align="left" width="128px">
</p>

# Loopbase (ON HOLD INDEFINITELY)

[![Continuous Integration](https://github.com/StarburstAudio/loopbase/actions/workflows/CI.yml/badge.svg)](https://github.com/StarburstAudio/loopbase/actions/workflows/CI.yml)
[![CodeQL](https://github.com/StarburstAudio/loopbase/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/StarburstAudio/loopbase/actions/workflows/codeql-analysis.yml)
![License](https://img.shields.io/github/license/StarburstAudio/loopbase)
[![Codebeat](https://codebeat.co/badges/760770d0-04c6-4f13-99f9-8ef3e23199ea)](https://codebeat.co/projects/github-com-starburstaudio-loopbase-main)
[![Downloads](https://img.shields.io/github/downloads/StarburstAudio/loopbase/total)](https://github.com/StarburstAudio/loopbase/releases)

With loopbase, you can browse samples on Looperman and download them. Just search for whatever you need, save samples, and drag them into your DAW from the app! Loopbase is not affiliated with Looperman.

![Screenshot](https://user-images.githubusercontent.com/68156346/161435777-439a4893-a842-425e-b7cc-249d031e4503.png)

## 💻 Installing

THIS APP IS STILL IN ALPHA: You may encounter bugs, some features are missing or subject to change. If you want a pre-release, head over to the [releases section](https://github.com/StarburstAudio/loopbase/releases) and grab the latest one for your platform.

## 🛠️ Building

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

## 🙋 Contributing

> If you've already contributed to open-source, you may not need to read this. The TL;DR is that Loopbase uses a feature-branch workflow. Your branch is to be prefixed with `feature-`

If you want to contribute, feel free to look at the [issues](https://github.com/StarburstAudio/loopbase/issues) section. You can open an issue yourself if you have a suggestion or improvement. In that case, tag it as an `enhancement`. If your issue is with a bug or some other unexpected or unwanted behavior that you've noticed with the app, tag it as a `bug`.

If you want to resolve issues, do the following:
  * Ask to be assigned to the issue, continue if your request has been approved
  * Clone the repository (if you haven't already)
  * Create a new branch for the issue you're working on (prefix it with `feature-`)
  * Implement your changes, commit and push them
  * When you feel ready, open a pull request to have your changes merged
