# Quorum Check Frontend Feature Coverage

All items below are represented as interactive frontend workflows. External provider handshakes, production identity checks, delivery, billing, CRM synchronization, and realtime infrastructure still require backend integration.

## Voter

- Authentication: email flow plus Google and Apple frontend selection.
- Profile: voter role, editable profile, interests, location, and verification-level display.
- Discovery: personalized feed, trending/local poll discovery, search, filters, and organization following.
- Voting: multiple choice, rating, ranked choice, open response, instant results, and simulated live participation.
- Community: discussions, comments, sharing, notifications, and community membership.
- Rewards: points, badges, streaks, weekly challenges, and achievements.
- Privacy: anonymous/Geo/ID levels, privacy controls, bot/device/CAPTCHA settings, data export, and deletion confirmation.

## Creator

- Multi-step poll builder with four formats, draft state, scheduling, expiration, and approval controls.
- Location, age, and interest audience targeting.
- Share link, QR, embed, email, and SMS distribution selection.
- Response, demographic, geographic, realtime analytics, CSV export, and PDF export states.
- Organization profile, creator verification, team management, badges, and branding controls.

## Administration

- Flagged-content queue for spam, hate speech, misinformation, and poll approvals.
- Organization and creator verification workflows.
- User and poll management, moderation reporting, and system analytics.
- Trending, local prioritization, and feed-ranking controls.
- Bot protection, rate limiting, device fingerprinting, CAPTCHA, GDPR queues, and privacy audit states.

## Integrations

- Stripe subscription and identity configuration.
- Zoho CRM creator and sales-pipeline configuration.
- Supabase authentication, database, and realtime configuration.

## Routes

- Voter: `/feed`, `/discover`, `/voting-formats`, `/sentiment-map`, `/debate`, `/communities`, `/profile`, `/rewards`, `/notifications`, `/privacy-center`.
- Creator: `/creator-studio`, `/creator-analytics`, `/organization`.
- Admin: `/moderation`, `/platform-admin`, `/admin-dashboard`.
- System: `/integrations`.
