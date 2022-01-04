<img align="left" width="140" height="140" src="img/logo_readme.svg">
<h1>Loopbase</h1>
<p>A desktop client for Looperman</p>
<br>
<p align="center">
  <img width="800" src="https://i.imgur.com/Z7Q9scj.png">
</p>
  
> :warning: **THIS APP IS STILL IN ITS ALPHA STAGE**
> You may encounter bugs, some features are still missing.

With loopbase, you can browse samples on looperman and drag-and-drop them into your DAW. Use the righthand section to filter your search queries and save samples to your disk! Loopbase is not affiliated with Looperman.

## Installing

You can try the current alpha version by cloning this repository.

```sh
git clone https://github.com/StarburstAudio/loopbase
npm i
```

You can then run a launch script

```sh
# You have two options: You can start the app...
npm run start
# ...Or continuously watch its scss files for changes and recompile to css.
npm run watch-start
```

And lastly, you can also build the app

```sh
npm run build
```

## Contributing

You can find the issues that are to be tackled on [the project board](https://github.com/StarburstAudio/loopbase/projects/2). If you want to work on an issue that is yet to be assigned, just comment on it and start a pull request. If you're unsure on which one to pick, there are probably some tagged "help wanted" or "good first issue". If you find any bugs or otherwise, don't hesitate to file an issue for them, too.

There are some things that do need to be adressed before most other issues:
  - JS refactoring
  - SCSS refactoring
  - Redesign
    - Only goes for things that affect the front-end; Switch to the `visual-redesign` branch to contribute to the redesign (There's already a [prototype](https://www.figma.com/proto/uJP8u3soovR04vpmJreHnM/Loopbase-Redesign?node-id=45%3A6&scaling=min-zoom&page-id=0%3A1) to be implemented!)
