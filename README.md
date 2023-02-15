# h5p_gui_creator

This is a desktop app that allows you to mass create H5P content from input files. It is an electron app written in TypeScript and runs on NodeJS, meaning it's platform independent. Currently, it supports the *Flashcards*, *Dialog Cards*, *Memory Game* and *Find the Words* content type.

## Acknowledgements
The code from <a href="https://github.com/sr258/h5p-cli-creator">h5p-cli-creator</a> repository was referenced for this app.
Functionality for Memory Game was added from <a href="https://github.com/winry-brain/h5p-cli-creator">this</a> fork of the above repository.

## Coding conventions
All classes that exist in the actual H5P libraries or content types start with `H5p`, e.g. `H5pImage`. All classes that are part of the creator and don't exist in external libraries or content types don't start with this prefix.

## Developers' steps
Run `npm install` and `npm run build` to set up the project.
`npm start` starts up the app

For packaging, run `npx electron-packager . --platform=win32` to make a Windows application.
Run `npx electron-packager . --platform=darwin` for MacOS applications