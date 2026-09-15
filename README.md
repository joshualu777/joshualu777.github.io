# Joshua Lu's website

Personal portfolio configured for GitHub Pages at https://joshualu777.github.io.

## Local development

Use Node.js 24 and pnpm 10.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm test:collection
pnpm build
```

The static website is generated in `dist/client`. Only that directory is
uploaded by the Pages workflow; server build intermediates are not published.

## Publishing

Create the public repository `joshualu777/joshualu777.github.io` and push this
clean repository's `main` branch. In Settings → Pages, select GitHub Actions
as the build source. The Pages workflow deploys after each push to main.

This is a fresh snapshot with no prior repository history. Do not copy the
original project's Git directory, private backup folders, PDFs, or full
collection exports into this repository. Its collection CSV contains only the
19 public showcase cards. All tracked content is intended to be public.

See [GitHub's workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
