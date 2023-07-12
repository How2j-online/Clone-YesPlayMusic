---
outline: deep
---

# Runtime API Examples

This page demonstrates usage of some of the runtime APIs provided by VitePress.

The main `useData()` API can be used to access site, theme, and page data for the current page. It works in both `.md` and `.vue` files:

```md
<script setup>
import { useData } from 'vitepress'

const { theme, page, frontmatter } = useData()
</script>

## Results

### Theme Data

<pre>{{ theme }}</pre>

### Page Data

<pre>{{ page }}</pre>

### Page Frontmatter

<pre>{{ frontmatter }}</pre>
```

<script setup>
import { useData } from 'vitepress';

const { site, theme, page, frontmatter } = useData()
</script>

## Results

### Theme Data

<pre>{{ theme }}</pre>

### Page Data

<pre>{{ page }}</pre>

### Page Frontmatter

<pre>{{ frontmatter }}</pre>

## More

3. [搭建](https://juejin.cn/post/7223286759630127159)
   )[one](https://juejin.cn/post/7212597327579037756#heading-6)
4. [git lf](https://stackoverflow.com/questions/170961/whats-the-strategy-for-handling-crlf-carriage-return-line-feed-with-git)

Check out the documentation for the [full list of runtime APIs](https://vitepress.dev/reference/runtime-api#usedata).

```text
Clone
├─ docs
├─ public
│    ├─ favicon.ico
│    ├─ img
│    │    ├─ icons
│    │    ├─ logos
│    │    └─ touchbar
│    └─ robots.txt
├─ src
│    ├─ App.vue
│    ├─ assets
│    │    ├─ css
│    │    ├─ fonts
│    │    └─ icons
│    │
│    ├─ components
│    ├─ hooks
│    ├─ locales
│    ├─ router
│    ├─ store
│    ├─ utils
│    └─ views
└─ types
```
