<div align="center">
<img alt="React Substack" src="https://raw.githubusercontent.com/nosajio/react-substack/master/react-substack-logo.png" width="150px" />
</div>

<div align="center">
  <h1>React Substack</h1>
  <p></p>
</div>

[![GitHub license](https://img.shields.io/github/license/nosajio/react-substack.svg)](https://github.com/noasjio/react-substack/blob/master/LICENSE)

## ✨ Use Substack posts in React.
**✅ Access all posts as JSON for any Substack newsletter.**  
**✅ Get post content as content nodes, or as pre-compiled HTML.**  
**✅ Build a wordpress style blog for a Substack newsletter.**

## Demo
(coming soon)

## ⬇️ Installation
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

## ️🚀 Examples

### List posts
```jsx
import { useSubstack } from 'react-substack';

const PostsPage = () => {
  // Find a newsletter's subdomain by opening one of its posts and looking at the beginning of the URL
  const substack = useSubstack('newsletter-subdomain');

  return (
    <div className="posts">
      <h1>Posts</h1>
      {substack.state === 'loading' && 
        (<div className="loading">Loading</div>)}

      {substack.state === 'data' &&
        substack.posts.map(post => (
          <a className="post" href={`/read/${post.slug}`}>
            {post.cover && <img src={post.cover} />}
            <h2>{post.title}</h2>
          </a>
      ))}
    </div>
  )
}
```

### Single post
```jsx
import { usePost } from 'react-substack';

const PostsPage = () => {
  // Find a newsletter's subdomain by opening one of its posts and looking at the beginning of the URL
  const substack = usePost('newsletter-subdomain', 'post-slug');

  return (
    <div className="posts">
      {substack.state === 'loading' && 
        (<div className="loading">Loading</div>)}

      {substack.state === 'data' &&
        <div className="post">
          {post.cover && <img src={post.cover} />}
          <h2>{post.title}</h2>
          <div 
            className="body" 
            dangerouslySetInnerHTML={{__html: post.bodyHTML }} />
        </div>
      }
    </div>
  )
}
```

## ❔ How it works
As Substack doesn't have an official API, React Substack uses the Substack RSS feed usually provided to feed readers. The feed is parsed to capture metadata and all public posts as JSON for use in any React app.

### Proxy Server & CORS
Because this is a browser-first library it needs to make requests to third party servers via CORS. This is a problem when requesting a substack feed because the feed URL doesn't use CORS headers.

To get around CORS, this library is configured to use custom proxy server which is conveniently free to use and hosted at feed.reactsubstack.com.

The library will soon be updated with the proxy server bundled and configurable.

## 💜 Contribute
Contributions are welcome! If you find an issue or have a feature addition, you can either submit an issue or a pull request.

### Local build
Get a local build by running:
```sh
npm run build
```
Then you can include the library in a local React App for development.

### Testing
This is a test driven library, and all new features should also include unit tests. 

Tests are run with:
```sh
npm test
```

## ✅ Coming soon!
- [ ] Embedded tweets.
- [ ] Embedded videos.
- [ ] Progressive images.
- [ ] Configurable proxy.
- [ ] React Server Components support

## LICENSE
React Substack uses the MIT License.