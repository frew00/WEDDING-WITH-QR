const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const guideHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Romnick & Sheila Wedding System - Features & Design Specification Guide</title>
    <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
    <style>
        :root {
            --navy: #1D3557;
            --dusty-blue: #62839b;
            --light-blue: #9eb5c7;
            --off-white: #f7f9fa;
            --dark-navy: #0f2038;
            --grey: #5c646b;
            --accent-gold: #c5a059;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Montserrat', sans-serif;
            color: #2c3e50;
            background-color: #ffffff;
            line-height: 1.6;
            padding: 40px;
        }

        .header {
            border-bottom: 3px double var(--dusty-blue);
            padding-bottom: 25px;
            margin-bottom: 35px;
            text-align: center;
        }

        .header h1 {
            font-family: 'Playfair Display', serif;
            color: var(--navy);
            font-size: 2.4rem;
            margin-bottom: 8px;
        }

        .header .subtitle {
            font-family: 'Great Vibes', cursive;
            color: var(--dusty-blue);
            font-size: 2.2rem;
            margin-bottom: 10px;
        }

        .header .meta {
            font-size: 0.82rem;
            color: var(--grey);
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: 600;
        }

        .section-title {
            font-family: 'Playfair Display', serif;
            color: var(--navy);
            font-size: 1.6rem;
            border-left: 5px solid var(--dusty-blue);
            padding-left: 14px;
            margin: 35px 0 20px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        p {
            font-size: 0.92rem;
            margin-bottom: 14px;
            color: #4a5568;
        }

        /* Color Swatches Grid */
        .color-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 15px;
            margin: 20px 0 30px 0;
        }

        .color-card {
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 12px;
            text-align: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.04);
            background: #fff;
        }

        .swatch {
            height: 60px;
            border-radius: 6px;
            margin-bottom: 8px;
            border: 1px solid rgba(0,0,0,0.1);
        }

        .color-name {
            font-weight: 700;
            font-size: 0.85rem;
            color: var(--navy);
        }

        .color-code {
            font-size: 0.78rem;
            color: var(--grey);
            font-family: monospace;
        }

        /* Typography Cards */
        .type-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 18px;
            margin: 20px 0 30px 0;
        }

        .type-card {
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 18px;
            background: #f8fafc;
        }

        .type-card h3 {
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: var(--dusty-blue);
            margin-bottom: 8px;
        }

        .type-preview {
            margin: 10px 0;
            color: var(--navy);
        }

        /* Features Table */
        .feature-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0 30px 0;
            font-size: 0.88rem;
        }

        .feature-table th {
            background-color: var(--navy);
            color: white;
            text-align: left;
            padding: 12px 16px;
            font-family: 'Playfair Display', serif;
            letter-spacing: 1px;
            font-size: 0.95rem;
        }

        .feature-table td {
            padding: 12px 16px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: top;
        }

        .feature-table tr:nth-child(even) {
            background-color: #f8fafc;
        }

        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 0.72rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            background: #ebf3f9;
            color: var(--navy);
            border: 1px solid var(--light-blue);
        }

        /* Entourage Box */
        .entourage-box {
            background-color: #f1f5f9;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            padding: 22px;
            margin: 20px 0;
        }

        .entourage-box h4 {
            font-family: 'Playfair Display', serif;
            color: var(--navy);
            font-size: 1.1rem;
            margin-bottom: 10px;
            border-bottom: 2px solid var(--dusty-blue);
            padding-bottom: 4px;
        }

        .list-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            font-size: 0.85rem;
        }

        /* Instructions list */
        .app-steps {
            background: #fff8e6;
            border: 1px solid #f6e05e;
            border-radius: 10px;
            padding: 20px;
            margin: 25px 0;
        }

        .app-steps h4 {
            color: #744210;
            font-size: 1.05rem;
            margin-bottom: 10px;
        }

        .app-steps ol {
            padding-left: 20px;
            font-size: 0.9rem;
            color: #4a5568;
        }

        .app-steps li {
            margin-bottom: 8px;
        }

        .page-break {
            page-break-before: always;
        }
    </style>
</head>
<body>

    <div class="header">
        <h1>Romnick & Sheila Wedding System</h1>
        <div class="subtitle">Features Matrix & Design Specifications Blueprint</div>
        <div class="meta">PDF System Copy & Editing App Transfer Package • December 27, 2026</div>
    </div>

    <!-- 1. EXECUTIVE OVERVIEW -->
    <h2 class="section-title">1. Executive System Overview</h2>
    <p>
        The <strong>Romnick & Sheila Wedding System</strong> is an interactive, mobile-first invitation web application engineered with an elegant romantic aesthetic. It incorporates modern responsive design, subtle animations (pencil-drawn florals, smooth floating feathers), audio streaming, flip-card live countdown timer, dynamic entourage roster cards, venue map links, attire color swatches, and a native RSVP form.
    </p>

    <!-- 2. COLOR PALETTE & STYLING TOKENS -->
    <h2 class="section-title">2. Color Palette & Visual Design System</h2>
    <div class="color-grid">
        <div class="color-card">
            <div class="swatch" style="background-color: #1D3557;"></div>
            <div class="color-name">Royal Navy</div>
            <div class="color-code">#1D3557</div>
        </div>
        <div class="color-card">
            <div class="swatch" style="background-color: #62839b;"></div>
            <div class="color-name">Dusty Blue</div>
            <div class="color-code">#62839b</div>
        </div>
        <div class="color-card">
            <div class="swatch" style="background-color: #9eb5c7;"></div>
            <div class="color-name">Light Blue</div>
            <div class="color-code">#9eb5c7</div>
        </div>
        <div class="color-card">
            <div class="swatch" style="background-color: #f7f9fa; border: 1px solid #cbd5e1;"></div>
            <div class="color-name">Off-White</div>
            <div class="color-code">#f7f9fa</div>
        </div>
        <div class="color-card">
            <div class="swatch" style="background-color: #5c646b;"></div>
            <div class="color-name">Slate Grey</div>
            <div class="color-code">#5c646b</div>
        </div>
    </div>

    <h2 class="section-title">3. Typography Hierarchy</h2>
    <div class="type-grid">
        <div class="type-card">
            <h3>Headings Font</h3>
            <div class="type-preview" style="font-family: 'Playfair Display', serif; font-size: 1.3rem;">Playfair Display</div>
            <p style="font-size: 0.78rem;">Used for titles, section headers, timeline events, and countdown numbers.</p>
        </div>
        <div class="type-card">
            <h3>Script Accent</h3>
            <div class="type-preview" style="font-family: 'Great Vibes', cursive; font-size: 1.8rem; color: var(--dusty-blue);">Great Vibes</div>
            <p style="font-size: 0.78rem;">Used for names, decorative headers ("Our Love Story", "Entourage", "Invited").</p>
        </div>
        <div class="type-card">
            <h3>Body & Controls</h3>
            <div class="type-preview" style="font-family: 'Montserrat', sans-serif; font-weight: 500;">Montserrat</div>
            <p style="font-size: 0.78rem;">Used for body narrative, entourage lists, venue details, and RSVP form inputs.</p>
        </div>
    </div>

    <!-- 4. SYSTEM FEATURES MATRIX -->
    <h2 class="section-title">4. Complete System Feature Catalog</h2>
    <table class="feature-table">
        <thead>
            <tr>
                <th>Feature Module</th>
                <th>Description & Interaction Specs</th>
                <th>UI Component Type</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Interactive Wax Seal Envelope Overlay</strong></td>
                <td>Fixed full-screen cover featuring a 3D animated envelope flap, wax seal with "R&S" initials, and 3 Polaroid photos popping upward upon tap.</td>
                <td><span class="badge">Animation & Intro</span></td>
            </tr>
            <tr>
                <td><strong>Hero Banner & Date Announcement</strong></td>
                <td>Single-row script name display, arch-framed couple portrait, event date, time, and church location details.</td>
                <td><span class="badge">Header Section</span></td>
            </tr>
            <tr>
                <td><strong>Floating Particles (Feathers & Pencil Flowers)</strong></td>
                <td>SVG pencil-drawn white flowers floating on side edges + background falling feather particles with staggered sway animations.</td>
                <td><span class="badge">Visual Micro-Effects</span></td>
            </tr>
            <tr>
                <td><strong>Background Music Player</strong></td>
                <td>Floating music bar featuring play/pause toggle button, song title ("Ikaw at Ako - Johnoy Danao"), and active track playback timer.</td>
                <td><span class="badge">Audio Streaming</span></td>
            </tr>
            <tr>
                <td><strong>Live Flip-Card Countdown Timer</strong></td>
                <td>Dynamic JS countdown calculation calculating Days, Hours, Minutes, and Seconds with dual flip-card numeric displays.</td>
                <td><span class="badge">Dynamic Widget</span></td>
            </tr>
            <tr>
                <td><strong>Love Story & Polaroid Photo Grid</strong></td>
                <td>Soft-light blue color-graded photo frame gallery combining portrait, arch, and dual landscape grid orientations.</td>
                <td><span class="badge">Photo Gallery</span></td>
            </tr>
            <tr>
                <td><strong>Glassmorphic Entourage Cards</strong></td>
                <td>Frosted translucent cards (<code style="background:#e2e8f0; padding:2px 4px;">backdrop-filter: blur(12px)</code>) organizing Parents, Sponsors, Best Man, Maid of Honor, Groomsmen, Bridesmaids, Bearers, and Flower Girls.</td>
                <td><span class="badge">Entourage Roster</span></td>
            </tr>
            <tr>
                <td><strong>Event Schedule & Dashed Timeline</strong></td>
                <td>Minimalist round icon badges connected with dashed lines displaying Guest Arrival (2:00 PM), Ceremony (3:00 PM), Cocktail (4:30 PM), Dinner (5:30 PM), and Send Off (7:00 PM).</td>
                <td><span class="badge">Timeline</span></td>
            </tr>
            <tr>
                <td><strong>Interactive Location Map Links</strong></td>
                <td>Styled map pin buttons linking directly to Google Maps coordinates for Our Lady of Mount Carmel Parish.</td>
                <td><span class="badge">Navigation Link</span></td>
            </tr>
            <tr>
                <td><strong>Attire Guidelines & Color Palette Swatches</strong></td>
                <td>Formal dress code illustration card accompanied by interactive circular swatches for Dark Charcoal, Medium Grey, Steel Blue, Dusty Blue, Sky Blue, Deep Navy, and Pearl White.</td>
                <td><span class="badge">Guest Guide</span></td>
            </tr>
            <tr>
                <td><strong>Native Netlify RSVP Form & Modal</strong></td>
                <td>Full guest response form capturing Full Name, Plus-One Name, Attendance Radio Selectors, and Custom Wishes with submission handling.</td>
                <td><span class="badge">Interactive Form</span></td>
            </tr>
            <tr>
                <td><strong>Gift Registry & QR Transfer Card</strong></td>
                <td>Monetary gift note with embedded InstaPay QR code image card for online bank transfers.</td>
                <td><span class="badge">Registry Card</span></td>
            </tr>
        </tbody>
    </table>

    <div class="page-break"></div>

    <!-- 5. ENTOURAGE & CONTENT MANIFEST -->
    <h2 class="section-title">5. Complete Content & Entourage Manifest</h2>
    <div class="entourage-box">
        <h4>Key Event Metadata</h4>
        <p><strong>Couple:</strong> Romnick & Sheila</p>
        <p><strong>Wedding Date:</strong> Sunday, December 27, 2026 at 2:30 PM</p>
        <p><strong>Ceremony Venue:</strong> Our Lady of Mount Carmel Parish, Brgy. Dugmanon, Hinatuan, Surigao Del Sur</p>
        <p><strong>Attire Code:</strong> Formal / Semi-Formal (Navy, Dusty Blue, Charcoal, Pearl White)</p>
    </div>

    <div class="entourage-box">
        <h4>Entourage Roster Summary</h4>
        <div class="list-grid">
            <div>
                <p><strong>Parents of Groom:</strong> Melecio P. Siano Jr. (+), Catalina P. Siano</p>
                <p><strong>Parents of Bride:</strong> Pedro P. Padohinog, Madelyn S. Padohinog</p>
                <p><strong>Best Man:</strong> Melvin P. Siano</p>
                <p><strong>Maid of Honor:</strong> Sarah Jane P. Elicanal</p>
                <p><strong>Ring Bearer:</strong> Nathaniel Edd G. Espejon</p>
                <p><strong>Coin Bearer:</strong> Ace Vincent S. Sandig</p>
                <p><strong>Bible Bearer:</strong> Acequel S. Olaivar</p>
                <p><strong>Little Bride:</strong> Ma. Kyllie June D. Seat</p>
            </div>
            <div>
                <p><strong>Groomsmen:</strong> Louie James Baldomero, Gean Daniel P. Dalida, Kyle Gino P. Germones, Tchavez S. Seterra, Kaehl Jasper Malinao, Jimuel Cabilin, Brian Buñor, Wilf Portante</p>
                <p><strong>Bridesmaids:</strong> Jillian Baldomero, Jovelyn F. Portante, Anjelin Reign S. Padohinog, Angelie S. Segurigan, Ericha Duray, Quenvie Marie R. Serna, Meri Joyce S. Apio, Chea Daniela Shane N. Peras</p>
                <p><strong>Flower Girls:</strong> Akeerah Emery L. Rojas, Xoese Pebella I. Lauriza, Aaliyah Cailey P. Plata, Katelyn Coralat, Nathalie G. Espejon</p>
            </div>
        </div>
    </div>

    <!-- 6. EDITING APP TRANSFER GUIDE -->
    <h2 class="section-title">6. How to Transfer & Edit this System in Editing Apps</h2>
    <div class="app-steps">
        <h4>Transfer Instructions by App:</h4>
        <ol>
            <li><strong>Canva:</strong> Open Canva -> Click <em>Create a Design</em> -> Select <em>Import File</em> -> Choose <code style="background:#fff; padding:2px 4px; border-radius:4px;">Wedding_Website_Full_Visual_Layout.pdf</code> or <code style="background:#fff; padding:2px 4px; border-radius:4px;">Wedding_Website_A4_Printable.pdf</code>. Canva will automatically break down elements into editable text, vectors, and swatches.</li>
            <li><strong>Figma:</strong> Drag and drop the PDF file directly into your Figma workspace canvas. Figma will convert pages into editable Frames with text nodes, font styles, and images.</li>
            <li><strong>Adobe Illustrator / Photoshop:</strong> File -> Open -> Select <code style="background:#fff; padding:2px 4px; border-radius:4px;">Wedding_Website_Full_Visual_Layout.pdf</code>. Select <em>Import as Vector Pages</em> to modify paths, typography, and color gradients.</li>
            <li><strong>GoodNotes / Acrobat / iPad Apps:</strong> Open the PDF file directly as a digital notebook, print document, or vector markup file.</li>
        </ol>
    </div>

</body>
</html>`;

async function generateGuidePdf() {
    const htmlPath = path.resolve(__dirname, 'features_guide.html');
    fs.writeFileSync(htmlPath, guideHtmlContent);
    console.log('Saved features_guide.html');

    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const browser = await puppeteer.launch({
        executablePath: edgePath,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise(r => setTimeout(r, 2000));

    const pdfPath = path.resolve(__dirname, 'Wedding_System_Features_and_Design_Guide.pdf');
    await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: { top: '30px', right: '30px', bottom: '30px', left: '30px' }
    });

    console.log('Successfully created:', pdfPath);
    await browser.close();
}

generateGuidePdf().catch(err => {
    console.error('Error creating Guide PDF:', err);
    process.exit(1);
});
