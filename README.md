A responsive, interactive website for comparing hotel prices across major Online Travel Agencies (OTAs) like Booking.com, Expedia, Hotels.com, Agoda, and Airbnb. Built as a prep project for Ausbildung in web development, it fetches real-time prices via the Xotelo API, showcases vibrant visuals, and integrates Expedia package bundles for seamless redirects.
🚀 Features

Real-Time Price Comparison: Search by city and dates to view live hotel prices from 4+ OTAs, with the best deal highlighted.
Mock Fallbacks: Graceful degradation to sample data if API limits hit—ensures smooth UX.
Interactive UI: Hero carousel with high-res beach/resort images, floating particles, confetti on best deals, and smooth animations (e.g., form sparkles, table flips).
Smart Search: Autocomplete for popular cities (Paris, Berlin, etc.) and default dates (tomorrow +1 night).
Expedia Packages Integration: Always-visible section with dynamic links to bundled deals (hotels + flights/cars)—pre-filled with user inputs or defaults.
Featured Teasers: Scrollable cards for quick inspiration (e.g., "Paris + Flight" bundles) with direct Expedia redirects.
Responsive Design: Mobile-first with Bootstrap—works on phones, tablets, desktops.
Accessibility: Reduced motion support, alt text, keyboard nav.

🛠️ Tech Stack

Frontend: HTML5, CSS3 (custom animations/gradients), Vanilla JavaScript (ES6+).
Styling: Bootstrap 5.3 (CDN for grids/buttons/tables).
API: Xotelo (via RapidAPI) for hotel search/rates; Expedia URLs for packages.
Icons/Images: Font Awesome (CDN), Unsplash (royalty-free high-res photos).
Deployment: GitHub Pages (static hosting).
Tools: VS Code, Live Server extension for dev.

API & Keys

RapidAPI Key: Stored in script.js (replace with your own from rapidapi.com—free tier: 500 calls/month).
Expedia Links: Direct URLs—no key needed; personalize via search params.
Rate Limits: Xotelo free tier—fallback to mocks if exceeded.

📝 Contributing

Fork the repo.
Create a feature branch: git checkout -b feature/amazing-idea.
Commit changes: git commit -m 'Add cool feature'.
Push: git push origin feature/amazing-idea.
Open a Pull Request—I'll review!

Suggestions: More OTAs (e.g., Airbnb API), charts (Chart.js), or user auth (Firebase).
📄 License
This project is MIT licensed—use freely, but credit if forked. See LICENSE for details.
🙏 Acknowledgments

Xotelo API for prices.
Unsplash for images.
Bootstrap & Font Awesome for UI.
