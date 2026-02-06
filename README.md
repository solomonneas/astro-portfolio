# Solomon Neas | Personal Portfolio

My personal portfolio at [solomonneas.dev](https://solomonneas.dev). Built with Astro 5, Tailwind CSS 4, and deployed on Vercel. Terminal-inspired design with dynamic color themes that rotate on each visit.

## Tech Stack

- **Framework:** Astro 5 with file-based routing
- **Styling:** Tailwind CSS 4 with custom terminal theme system
- **Analytics:** Vercel Web Analytics
- **Hosting:** Vercel (auto-deploy from `main`)
- **Content:** Static `.astro` pages (no CMS)

## Features

- **Dynamic Themes:** Curated color palettes that cycle on page load, with manual toggle
- **Terminal Aesthetic:** Monospace typography, status indicators, command-prompt headers
- **Interactive Components:** PDF carousel, experience timeline, certifications terminal, education terminal
- **Blog:** Slug-based routing with markdown support
- **20+ Project Pages:** Detailed write-ups for infrastructure, security, and development projects

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with README-style terminal intro |
| `/projects` | Project index |
| `/experience` | Work experience timeline |
| `/about` | Background and bio |
| `/blog` | Blog posts |
| `/resources` | Tools, references, links |
| `/contact` | Contact info |
| `/hire` | Availability and services |

## Project Write-Ups

Infrastructure, security research, and development projects including:

- Watchtower NOC Dashboard
- Enterprise Network Observability
- Hyper-V to Proxmox Migration
- Designing and Building an Open-Source SOC
- APT-44 Cyber Intelligence Report
- Securing US Water and Wastewater Utilities
- PortGrid Network Visualization
- LAIM (LLM-Assisted Incident Management)
- Proxmox Homelab
- Samba AD File Server
- And more

## Subdomain Ecosystem

This portfolio is the hub of a growing network of project-specific sites:

| Subdomain | Project |
|-----------|---------|
| [termfolio.solomonneas.dev](https://termfolio.solomonneas.dev) | Terminal-style resume |
| [mockwatchtower.solomonneas.dev](https://mockwatchtower.solomonneas.dev) | NOC monitoring dashboard |
| brohunter.solomonneas.dev | Network threat hunting tool |
| modelarena.solomonneas.dev | AI model comparison arena |
| playbook.solomonneas.dev | SOC playbook builder |
| soc.solomonneas.dev | SOC showcase |

## Development

```bash
npm install
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build
```

## License

MIT
