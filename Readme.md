<div align="center">
<img alt="React Substack" src="https://raw.githubusercontent.com/nosajio/react-substack/master/react-substack-logo.png" width="150px" />
</div>

<h1 align="center">React Substack</h1>

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

## ✅ Coming soon!
- [ ] Embedded tweets.
- [ ] Embedded videos.
- [x] Blockquotes.
- [x] Nested lists.
- [ ] Progressive images.
- [ ] Configurable proxy.

## 🌎 Proxy Server & CORS
Because this is a browser-first library it needs to make requests to third party servers via CORS. This is a problem when requesting a substack feed because the feed URL doesn't use CORS headers.

To get around CORS, this library is configured to use custom proxy server which is conveniently free to use and hosted at feed.reactsubstack.com.

The library will soon be updated to have the proxy server bundled and configurable.