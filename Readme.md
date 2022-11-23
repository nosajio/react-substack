<h1 align="center">React Substack Library</h1>

[![Tweet][twitter-badge]][twitter]
[![Follow][twitter-follow-badge]][twitter-follow]
[![Star][github-star-badge]][github-star]

[![Version][version-badge]][package]
[![Size][size-badge]][size]
[![Types][type-badge]][package]

## Installation
**pnpm**
```sh
pnpm add react-substack
```

**npm**
```sh
npm install react-substack
```

**yarn**
```sh
yarn add react-substack
```

## Usage

## Coming soon!
- [] Embedded tweets.
- [] Embedded videos.
- [x] Blockquotes.
- [x] Nested lists.
- [] Progressive images.
- [] Configurable proxy.

## Proxy Server & CORS
Because this is a browser-first library it needs to make requests to third party servers via CORS. This is a problem when requesting a substack feed because the feed URL doesn't use CORS headers.

To get around CORS, this library is configured to use custom proxy server which is conveniently free to use and hosted at feed.reactsubstack.com.

The library will soon be updated to have the proxy server bundled and configurable.