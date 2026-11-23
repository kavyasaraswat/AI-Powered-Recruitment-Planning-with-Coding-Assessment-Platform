# HireGenius AI — Figma Design Integration Specification

## 1. Connected Figma Environment
- **Connected User**: Naruto (`kavyanaruto2005@gmail.com`)
- **Team**: Naruto's team (`team::1706693942920300610`)
- **Design System File URL**: [https://www.figma.com/design/HvScH10Koq97Ee3Xn3BV3z](https://www.figma.com/design/HvScH10Koq97Ee3Xn3BV3z)
- **Figma File Key**: `HvScH10Koq97Ee3Xn3BV3z`
- **Primary Canvas Page**: `🎨 Design System & 17 SaaS Screens`

---

## 2. Canvas Artboard Map & Node References

| Section / Artboard | Node ID | Description |
|---|---|---|
| **Header Banner** | `1:2` | Project Branding, Typography spec & CSE project badge |
| **Color Tokens Board** | `1:7` | Swatches for Primary, Accent, Dark Slate, Emerald, Amber, Rose, Zinc |
| **17 SaaS Screens Blueprint** | `1:49` | 4-column structured matrix for all 17 core application views |

### Screen Nodes in Figma:
- `1:51` — **Screen 1**: Landing Page (`/`)
- `1:56` — **Screen 2**: Login Page (`/login`)
- `1:61` — **Screen 3**: Registration Page (`/register`)
- `1:66` — **Screen 4**: Candidate Dashboard (`/candidate/dashboard`)
- `1:71` — **Screen 5**: Recruiter Dashboard (`/recruiter/dashboard`)
- `1:76` — **Screen 6**: Administrator Dashboard (`/admin/dashboard`)
- `1:81` — **Screen 7**: Job Listing Page (`/jobs`)
- `1:86` — **Screen 8**: Job Details Page (`/jobs/:id`)
- `1:91` — **Screen 9**: Candidate Profile (`/candidate/profile`)
- `1:96` — **Screen 10**: Resume Upload Page (`/candidate/resume`)
- `1:101` — **Screen 11**: Coding Assessment Interface (`/assessment/:id`)
- `1:106` — **Screen 12**: AI Chatbot Interface (`/chat`)
- `1:111` — **Screen 13**: Pricing Page (`/pricing`)
- `1:116` — **Screen 14**: Subscription Management (`/billing`)
- `1:121` — **Screen 15**: Payment Checkout Page (`/checkout/:planId`)
- `1:126` — **Screen 16**: Recruiter Analytics (`/recruiter/analytics`)
- `1:131` — **Screen 17**: Settings Page (`/settings`)

---

## 3. Design-to-Code Implementation Strategy
1. **Tokens Export**: Colors, typography, spacing, and shadows in Figma map directly to `tailwind.config.js` extensions and CSS custom properties.
2. **Component Mapping**: Every Figma card structure corresponds to a modular React component in `frontend/src/components/`.
3. **Accessibility**: All color pairings conform to WCAG 2.1 AA contrast requirements (minimum 4.5:1 ratio for standard text, 3:1 for large display text).
