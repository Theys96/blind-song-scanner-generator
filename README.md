# Blind Song Scanner - Generator

> **Live at:** [generate.blindsongscanner.com](https://generate.blindsongscanner.com/)

Web app that takes a Spotify playlist link and allows the user to create tiles with the song details on one side and a track QR code on the other.
These QR codes can be scanned by the Blind Song Scanner web app to play the songs: [https://github.com/Theys96/blind-song-scanner](https://github.com/Theys96/blind-song-scanner)

<img align="left" src="src/assets/cards.jpeg" width="700px" alt="Printed cards" />

---

## Setup

1. **Install Node.js** (recommended: v18.x or v20.x)
2. Clone the repository:
   ```sh
   git clone https://github.com/Theys96/blind-song-scanner-generator.git
   cd blind-song-scanner-generator
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

## Environment Variables

Create a `.env` file based on `.env.example`.

## Contribution Guide

- Fork the repository and create a feature branch.
- Write clear, documented code.
- Run `npm run lint` before every commit.
- Create a pull request with a description of your changes.

## FAQ

**How can I scan a playlist?**
> Enter the Spotify link and follow the instructions.

**How can I generate QR codes?**
> After inserting the playlist, the cards and QR codes are generated automatically.

**Who do I contact if I have problems?**
> Create an issue or contact the maintainers via GitHub.

---
