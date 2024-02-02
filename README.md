# Azle (patched for AgorApp)

This is a patched version of the `pic` project. Aim of these patches it to make it work with AgorApp.

Changes against original:

- Use newer version of `pocket-ic`
- Get direct access to unserialized values
-

## Build

```bash
pnpm build
```

## Publish

```
# Create orphan branch
git checkout --orphan v0.2.1-agorapp.2

# Build dist
pnpm build

# Move packages/pic to root, make sure dist is not in .gitignore
# commit and push
```
