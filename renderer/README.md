# Renderer

This directory is for files that run in a `renderer` electron process.

The two renderer process in Hyperamp are the Player and Audio windows.

- `audio` - Background audio process. Exposes interface for HTML audio element over IPC.
- `player` - GUI (playlist, player controls)
- `shared` - resources shared between processes
