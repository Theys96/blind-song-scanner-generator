import jsPDF from 'jspdf';
import QRCode from 'qrcode';

const TILE_SIZE_CM = 6;
const TILES_PER_ROW = 3;
const MARGIN_CM = 1.5;
const SPACING_CM = 0;

export async function generatePDF(
  songs: { title: string; artist: string; year: number; spotifyUri: string }[],
) {
  const pdf = new jsPDF({
    putOnlyUsedFonts: true,
    unit: 'cm',
    format: 'a4',
  });

  // Enable UTF-8 support by adding the default font
  pdf.setFont('helvetica');
  pdf.setLanguage('en-US');

  const pageWidth = 21; // A4 width in cm
  const pageHeight = 29.7; // A4 height in cm

  for (let i = 0; i < songs.length; i++) {
    const song = songs[i];
    const row = Math.floor((i % (TILES_PER_ROW * 4)) / TILES_PER_ROW);
    const col = i % TILES_PER_ROW;

    // Front side (odd pages)
    if (i > 0 && i % (TILES_PER_ROW * 4) === 0) {
      pdf.addPage();
    }

    const x = MARGIN_CM + col * (TILE_SIZE_CM + SPACING_CM); // Reduced spacing between tiles
    const y = MARGIN_CM + row * (TILE_SIZE_CM + SPACING_CM);

    // Add page link at the bottom if this is the first tile on the page
    if (i % (TILES_PER_ROW * 4) === 0) {
      pdf.setFontSize(8);
      pdf.setTextColor(100);
      pdf.text(
        'generate.blindsongscanner.com',
        pageWidth / 2,
        pageHeight - 0.5,
        { align: 'center' },
      );
      pdf.setTextColor(0);
    }

    // Draw tile border
    pdf.setLineWidth(0.01); // Set very thin line width
    pdf.setDrawColor(0);
    pdf.rect(x, y, TILE_SIZE_CM, TILE_SIZE_CM);

    // Add song information
    pdf.setFontSize(12);
    pdf.text(song.artist, x + 3, y + 1, {
      maxWidth: TILE_SIZE_CM - 0.5,
      align: 'center',
    });
    pdf.setFontSize(14);
    pdf.text(song.title, x + 3, y + 3, {
      maxWidth: TILE_SIZE_CM - 0.5,
      align: 'center',
    });
    pdf.setFontSize(18);
    pdf.text(String(song.year || ''), x + 3, y + 5.3, {
      maxWidth: TILE_SIZE_CM - 0.5,
      align: 'center',
    });

    // Back side (even pages)
    if (i % (TILES_PER_ROW * 4) === TILES_PER_ROW * 4 - 1) {
      pdf.addPage();
      const backPageIndex = Math.floor(i / (TILES_PER_ROW * 4));

      // Generate QR codes for the previous set of tiles
      for (let j = 0; j < TILES_PER_ROW * 4; j++) {
        const songIndex = backPageIndex * (TILES_PER_ROW * 4) + j;
        if (songIndex >= songs.length) break;

        const backRow = Math.floor(j / TILES_PER_ROW);
        const backCol = TILES_PER_ROW - 1 - (j % TILES_PER_ROW);

        const backX = MARGIN_CM + backCol * (TILE_SIZE_CM + SPACING_CM);
        const backY = MARGIN_CM + backRow * (TILE_SIZE_CM + SPACING_CM);

        // Draw tile border
        pdf.setLineWidth(0.01); // Set very thin line width
        pdf.rect(backX, backY, TILE_SIZE_CM, TILE_SIZE_CM);

        // Generate and add QR code
        try {
          const spotifyUrl = songs[songIndex].spotifyUri.replace(
            'spotify:track:',
            'https://open.spotify.com/track/',
          );
          const qrDataUrl = await QRCode.toDataURL(spotifyUrl, {
            width: TILE_SIZE_CM * 28.35, // Convert cm to points (1 cm = 28.35 points)
            margin: 1,
          });

          pdf.addImage(
            qrDataUrl,
            'PNG',
            backX + 0.8,
            backY + 0.8,
            TILE_SIZE_CM - 1.6,
            TILE_SIZE_CM - 1.6,
          );
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      }
    }
  }

  // Add final back page if needed
  if (songs.length % (TILES_PER_ROW * 4) !== 0) {
    pdf.addPage();
    const remainingTiles = songs.length % (TILES_PER_ROW * 4);
    const lastPageIndex = Math.floor((songs.length - 1) / (TILES_PER_ROW * 4));

    for (let j = 0; j < remainingTiles; j++) {
      const songIndex = lastPageIndex * (TILES_PER_ROW * 4) + j;
      const backRow = Math.floor(j / TILES_PER_ROW);
      const backCol = TILES_PER_ROW - 1 - (j % TILES_PER_ROW);

      const backX = MARGIN_CM + backCol * (TILE_SIZE_CM + SPACING_CM);
      const backY = MARGIN_CM + backRow * (TILE_SIZE_CM + SPACING_CM);

      pdf.setLineWidth(0.01); // Set very thin line width
      pdf.rect(backX, backY, TILE_SIZE_CM, TILE_SIZE_CM);

      try {
        const spotifyUrl = songs[songIndex].spotifyUri.replace(
          'spotify:track:',
          'https://open.spotify.com/track/',
        );
        const qrDataUrl = await QRCode.toDataURL(spotifyUrl, {
          width: TILE_SIZE_CM * 28.35,
          margin: 1,
        });

        pdf.addImage(
          qrDataUrl,
          'PNG',
          backX + 0.8,
          backY + 0.8,
          TILE_SIZE_CM - 1.6,
          TILE_SIZE_CM - 1.6,
        );
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    }
  }

  // Add page link to the final back page
  pdf.setFontSize(8);
  pdf.setTextColor(100);
  pdf.text('generate.blindsongscanner.com', pageWidth / 2, pageHeight - 0.5, {
    align: 'center',
  });
  pdf.setTextColor(0);

  return pdf;
}
