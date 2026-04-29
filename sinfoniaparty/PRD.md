# PRD: The Sinfonia Event Website

## 1. Project Overview
**The Sinfonia** is an exclusive event website designed to serve as the primary information hub for guests. It brings together prominent figures from the wedding industry in Vietnam. The digital experience must reflect the prestige, elegance, and heritage of the event.

## 2. Brand & Aesthetic Identity
*   **Vibe:** Classy, Elegant, European Vintage.
*   **Color Palette:**
    *   Primary Accent: `#4b5006` (Deep Olive / Vintage Forest)
    *   Background: `#fff8eb` (Antique Cream / Parchment)
    *   Text: Deep Charcoal or the Primary Accent for headers.
*   **Typography:**
    *   Display/Headings: **Amsterdam** (Sophisticated Script/Serif for a vintage look)
    *   Body/UI: **Montserrat** (Modern Sans-Serif for clarity)

## 3. Technical Stack
*   **Framework:** Next.js 15+ (App Router)
*   **Styling:** Tailwind CSS 4.0
*   **Animation:** GSAP (GreenSock Animation Platform) for cinematic reveals and transitions.
*   **Guidelines:** Adhering to `.agent` skill guides for frontend excellence and performance.

## 4. User Journey & Sitemap (One-Page Immersive)

| Order | Section | Content/Functionality | Key Animation Goal |
| :--- | :--- | :--- | :--- |
| 1 | **Opening** | Immersive pre-loader or entrance animation. | Fade in/out of "The Sinfonia" logo with a vintage texture overlay. |
| 2 | **Hero Section** | Main branding: "The Sinfonia", Date, and Location. | Split-text reveal of the title using GSAP. |
| 3 | **Time & Places** | Venue name, address, and interactive map link. | Elegant sliding reveal of location cards. |
| 4 | **Agendas** | Detailed timeline of the day's activities. | Staggered list items appearing on scroll. |
| 5 | **RSVP** | Guest confirmation form (Name, Attendance, Dietary). | Smooth form field transitions and success state animation. |
| 6 | **Dresscode** | Visual guide for European Vintage attire. | Hover effects on mood-board images. |
| 7 | **Contact Us** | Organizer contact details and help links. | Clean, simple appearance at the bottom. |
| 8 | **Thank You Note** | A sincere closing message. | Slow fade-out/closing visual. |

## 5. Design System Details
### Color Tokens
- `--color-primary`: `#4b5006`
- `--color-bg`: `#fff8eb`

### Typography Implementation
- `font-display`: 'Amsterdam', serif;
- `font-body`: 'Montserrat', sans-serif;

## 6. Functional Requirements
- **Responsive Design:** Must look premium on iPhone/Android and Desktop.
- **Scroll Performance:** High-quality GSAP scroll triggers without lag.
- **SEO:** Optimized meta tags for the event.
- **Accessibility:** High contrast for text against the cream background.

## 7. Implementation Phases
1. **Foundation:** Setup theme colors, fonts, and GSAP integration.
2. **Layout:** Build the skeleton of all 8 sections.
3. **Animations:** Layer in the GSAP "magic" for the vintage vibe.
4. **Logic:** Implement the RSVP form and contact links.
5. **Polishing:** UX audit and performance optimization.

---
*Created by Antigravity AI Agent*
