# jupyterspot

[![Github Actions Status](https://github.com/jupyterspot/extension/workflows/Build/badge.svg)](https://github.com/jupyterspot/extension/actions/workflows/build.yml)
[![Latest Version](https://img.shields.io/pypi/v/jupyterspot.svg)](https://pypi.python.org/pypi/jupyterspot)

<p align="center">
<img src="https://jupyterspot.com/static/img/jspot/logo-w350.png", alt="logo">
</p>

Instead of screen-sharing a Jupyter notebook, share a link to a real-time collaborative whiteboard with live cursors, scroll syncing, freehand drawings, text, and sticky notes. The notebook is converted to HTML with nbconvert, then a [tldraw](https://github.com/tldraw/tldraw) whiteboard is overlaid on top.

![sd-demo](https://jupyterspot.com/static/img/jspot/sd-demo.gif)

- Initially, everyone's scroll position in the notebook syncs with the presenter.
- Become the scroll leader to ask a question about something the presenter scrolled past and have all participants follow you.
- Break away and scroll on your own to review that figure you didn't have enough time to parse.

![scroll-demo](https://jupyterspot.com/static/img/jspot/jspot-demo-003.gif)

Create a [free account](https://jupyterspot.com/signup) to get an API key, then click the "Open in JupyterSpot" button to see your notebook's whiteboard. Check out the [documentation](https://jupyterspot.github.io/docs/adding-notebooks.html#adding-a-notebook-via-jupyterlab-extension) for more detailed instructions.

## Requirements

- JupyterLab >= 3.0

## Install

To install the extension, execute:

```bash
pip install jupyterspot
```

## Uninstall

To remove the extension, execute:

```bash
pip uninstall jupyterspot
```

## Contributing

### Development install

Note: You will need NodeJS to build the extension package.

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Change directory to the jupyterspot directory
# Install package in development mode
pip install -e .
# Link your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite
# Rebuild extension Typescript source after making changes
jlpm build
```

You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in the extension's source and automatically rebuild the extension.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
jlpm watch
# Run JupyterLab in another terminal
jupyter lab
```

With the watch command running, every saved change will immediately be built locally and available in your running JupyterLab. Refresh JupyterLab to load the change in your browser (you may need to wait several seconds for the extension to be rebuilt).

By default, the `jlpm build` command generates the source maps for this extension to make it easier to debug using the browser dev tools. To also generate source maps for the JupyterLab core extensions, you can run the following command:

```bash
jupyter lab build --minimize=False
```

### Development uninstall

```bash
pip uninstall jupyterspot
```

In development mode, you will also need to remove the symlink created by `jupyter labextension develop`
command. To find its location, you can run `jupyter labextension list` to figure out where the `labextensions`
folder is located. Then you can remove the symlink named `jupyterspot` within that folder.

### Testing the extension

#### Frontend tests

This extension is using [Jest](https://jestjs.io/) for JavaScript code testing.

To execute them, execute:

```sh
jlpm
jlpm test
```

#### Integration tests

This extension uses [Playwright](https://playwright.dev/docs/intro/) for the integration tests (aka user level tests).
More precisely, the JupyterLab helper [Galata](https://github.com/jupyterlab/jupyterlab/tree/master/galata) is used to handle testing the extension in JupyterLab.

More information are provided within the [ui-tests](./ui-tests/README.md) README.

### Packaging the extension

See [RELEASE](RELEASE.md)
