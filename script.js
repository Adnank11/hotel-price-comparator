// Your RapidAPI setup
const RAPIDAPI_KEY = 'af11a0c09bmshe2a1646cae0b253p16cc09jsn6dd5a6244182';
const RAPIDAPI_HOST = 'xotelo-hotel-prices.p.rapidapi.com';

// Mock data fallback (5 hotels, with Airbnb)
const mockHotels = [
    { 
        name: 'Sample Hotel Paris - Eiffel Tower View', 
        rates: { 'Booking.com': 150, 'Expedia': 140, 'Hotels.com': 145, 'Agoda': 135, 'Airbnb': 155 },
        image: 'https://via.placeholder.com/60x40/ff6b6b/ffffff?text=P' // Mock image
    },
    { 
        name: 'Luxury Inn Berlin - City Center', 
        rates: { 'Booking.com': 200, 'Expedia': 190, 'Hotels.com': 195, 'Agoda': 185, 'Airbnb': 210 },
        image: 'https://via.placeholder.com/60x40/4ecdc4/ffffff?text=L'
    },
    { 
        name: 'Cozy Hostel Rome - Historic District', 
        rates: { 'Booking.com': 80, 'Expedia': 75, 'Hotels.com': 85, 'Agoda': 70, 'Airbnb': 90 },
        image: 'https://via.placeholder.com/60x40/45b7d1/ffffff?text=C'
    },
    { 
        name: 'Grand Resort Madrid - Beachfront', 
        rates: { 'Booking.com': 250, 'Expedia': 240, 'Hotels.com': 245, 'Agoda': 230, 'Airbnb': 260 },
        image: 'https://via.placeholder.com/60x40/f9ca24/ffffff?text=G'
    },
    { 
        name: 'Budget Stay Amsterdam - Canal Side', 
        rates: { 'Booking.com': 120, 'Expedia': 115, 'Hotels.com': 125, 'Agoda': 110, 'Airbnb': 130 },
        image: 'https://via.placeholder.com/60x40/54a0ff/ffffff?text=B'
    }
];

// Popular cities for autocomplete
const popularCities = ['Paris', 'Berlin', 'Rome', 'Madrid', 'Amsterdam', 'London', 'New York', 'Tokyo'];

document.addEventListener('DOMContentLoaded', () => { // Single DOMContentLoaded
    // Floating Particles (beach waves)
    function createParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.width = Math.random() * 4 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }
    createParticles();

    // Set default dates (tomorrow to 2 days later—Oct 26-27, 2025)
    const tomorrow = new Date('2025-10-26'); // Based on current date Oct 25, 2025
    const twoDays = new Date('2025-10-27');
    document.getElementById('checkIn').value = tomorrow.toISOString().split('T')[0];
    document.getElementById('checkOut').value = twoDays.toISOString().split('T')[0];

    // Default Expedia Packages Link on Load (always visible, no search needed)
    const defaultCity = 'Paris';
    const defaultCheckIn = '10/26/2025'; // MM/DD/YYYY
    const defaultCheckOut = '10/27/2025';
    const defaultExpediaUrl = `https://www.expedia.com/Packages?destination=${encodeURIComponent(defaultCity)}&startDate=${defaultCheckIn}&endDate=${defaultCheckOut}&adults=2`;
    const expediaLink = document.getElementById('expediaLink');
    if (expediaLink) {
        expediaLink.href = defaultExpediaUrl;
        expediaLink.textContent = `Explore ${defaultCity} Packages`;
    }

    // Confetti Function (optimized)
    function launchConfetti() {
        const canvas = document.getElementById('confetti');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const pieces = [];
        for (let i = 0; i < 50; i++) {
            pieces.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                size: Math.random() * 10 + 5,
                speed: Math.random() * 3 + 1,
                color: `hsl(${Math.random() * 360}, 70%, 60%)`,
                rotation: 0 // For flair
            });
        }
        
        let frame = 0;
        function animate() {
            frame++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pieces.forEach(piece => {
                piece.y += piece.speed;
                piece.rotation += 5; // Spin
                ctx.save();
                ctx.translate(piece.x, piece.y);
                ctx.rotate(piece.rotation * Math.PI / 180);
                ctx.fillStyle = piece.color;
                ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
                ctx.restore();
            });
            if (frame < 100 && pieces.some(p => p.y < canvas.height)) {
                requestAnimationFrame(animate);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        animate();
    }

    // Single form submit handler
    document.getElementById('searchForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const city = document.getElementById('city').value;
        const checkIn = document.getElementById('checkIn').value;
        const checkOut = document.getElementById('checkOut').value;

        if (!city || !checkIn || !checkOut) {
            alert('Please fill all fields!');
            return;
        }

        // Loading state
        const searchBtn = document.getElementById('searchBtn');
        const spinner = searchBtn.querySelector('.spinner-border');
        searchBtn.disabled = true;
        spinner.classList.remove('d-none');
        searchBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Searching...';

        // Show results section
        document.getElementById('results').style.display = 'block';
        const tbody = document.getElementById('resultsTable');
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Loading...</td></tr>';

        let tableRows = [];

        try {
            // Step 1: Search hotels by city (RapidAPI)
            const searchResponse = await fetch(`https://xotelo-hotel-prices.p.rapidapi.com/api/search?query=${encodeURIComponent(city)}&location_type=accommodation`, {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': RAPIDAPI_KEY,
                    'X-RapidAPI-Host': RAPIDAPI_HOST
                }
            });
            const searchData = await searchResponse.json();

            if (searchData.error) {
                throw new Error('Search failed: ' + (searchData.error.message || 'Unknown issue'));
            }

            const hotels = searchData.result?.list?.slice(0, 5) || [];

            for (const hotel of hotels) {
                // Step 2: Get rates
                const ratesResponse = await fetch(`https://xotelo-hotel-prices.p.rapidapi.com/api/rates?hotel_key=${hotel.hotel_key}&chk_in=${checkIn}&chk_out=${checkOut}`, {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': RAPIDAPI_KEY,
                        'X-RapidAPI-Host': RAPIDAPI_HOST
                    }
                });
                const ratesData = await ratesResponse.json();

                if (ratesData.error) continue;

                const rates = ratesData.result?.rates?.reduce((acc, rate) => {
                    acc[rate.name] = rate.rate;
                    return acc;
                }, {}) || {};

                rates['Airbnb'] = rates['Airbnb'] || 'N/A';

                const hotelImage = hotel.image || 'https://via.placeholder.com/60x40/007bff/ffffff?text=Hotel';

                const prices = Object.values(rates).filter(p => p !== 'N/A').map(Number);
                let bestPrice = 'N/A';
                let bestOta = 'N/A';
                if (prices.length > 0) {
                    bestPrice = Math.min(...prices);
                    bestOta = Object.entries(rates).find(([name, price]) => Number(price) === bestPrice)?.[0] || 'N/A';
                }

                tableRows.push(`
                    <tr>
                        <td>
                            <img src="${hotelImage}" alt="${hotel.name}" class="hotel-img">
                            ${hotel.name}
                        </td>
                        <td>$${rates['Booking.com'] || 'N/A'}</td>
                        <td>$${rates['Expedia'] || 'N/A'}</td>
                        <td>$${rates['Hotels.com'] || 'N/A'}</td>
                        <td>$${rates['Agoda'] || 'N/A'}</td>
                        <td>$${rates['Airbnb'] || 'N/A'}</td>
                        <td><span class="badge bg-success">$${bestPrice} (${bestOta})</span></td>
                    </tr>
                `);
            }

            if (tableRows.length === 0) {
                tableRows = mockHotels.map(hotel => {
                    const prices = Object.values(hotel.rates).map(Number);
                    const bestPrice = Math.min(...prices);
                    const bestOta = Object.entries(hotel.rates).find(([_, price]) => price === bestPrice)[0];
                    return `
                        <tr>
                            <td>
                                <img src="${hotel.image}" alt="${hotel.name}" class="hotel-img">
                                ${hotel.name}
                            </td>
                            <td>$${hotel.rates['Booking.com']}</td>
                            <td>$${hotel.rates['Expedia']}</td>
                            <td>$${hotel.rates['Hotels.com']}</td>
                            <td>$${hotel.rates['Agoda']}</td>
                            <td>$${hotel.rates['Airbnb']}</td>
                            <td><span class="badge bg-success">$${bestPrice} (${bestOta})</span></td>
                        </tr>
                    `;
                });
            }

            tbody.innerHTML = tableRows.join('');
        } catch (error) {
            console.error('API Error:', error);
            const mockRows = mockHotels.map(hotel => {
                const prices = Object.values(hotel.rates).map(Number);
                const bestPrice = Math.min(...prices);
                const bestOta = Object.entries(hotel.rates).find(([_, price]) => price === bestPrice)[0];
                return `
                    <tr>
                        <td>
                            <img src="${hotel.image}" alt="${hotel.name}" class="hotel-img">
                            ${hotel.name}
                        </td>
                        <td>$${hotel.rates['Booking.com']}</td>
                        <td>$${hotel.rates['Expedia']}</td>
                        <td>$${hotel.rates['Hotels.com']}</td>
                        <td>$${hotel.rates['Agoda']}</td>
                        <td>$${hotel.rates['Airbnb']}</td>
                        <td><span class="badge bg-success">$${bestPrice} (${bestOta})</span></td>
                    </tr>
                `;
            }).join('');
            tbody.innerHTML = mockRows;
        } finally {
            // Reset button
            searchBtn.disabled = false;
            spinner.classList.add('d-none');
            searchBtn.innerHTML = 'Search Hotels';

            // Update Expedia Link with Search Params
            if (city && checkIn && checkOut) {
                const encodedCheckIn = checkIn.replace(/-/g, '/');
                const encodedCheckOut = checkOut.replace(/-/g, '/');
                const expediaUrl = `https://www.expedia.com/Packages?destination=${encodeURIComponent(city)}&startDate=${encodedCheckIn}&endDate=${encodedCheckOut}&adults=2`;
                if (expediaLink) {
                    expediaLink.href = expediaUrl;
                    expediaLink.textContent = `Explore ${city} Packages`;
                }
            }
        }

        // Trigger confetti on best deals
        const bestDealCells = document.querySelectorAll('.badge.bg-success');
        bestDealCells.forEach(cell => {
            cell.addEventListener('mouseenter', launchConfetti);
        });
    });

    // Merged City Autocomplete + Sparkle
    document.getElementById('city').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const suggestions = document.getElementById('citySuggestions');
        if (query.length < 2) {
            suggestions.style.display = 'none';
            return;
        }
        const matches = popularCities.filter(city => city.toLowerCase().includes(query));
        suggestions.innerHTML = matches.map(city => `<li onclick="selectCity('${city}')">${city}</li>`).join('');
        suggestions.style.display = matches.length ? 'block' : 'none';

        // Sparkle effect
        e.target.classList.add('sparkle');
        setTimeout(() => e.target.classList.remove('sparkle'), 300);
    });

    function selectCity(city) {
        document.getElementById('city').value = city;
        document.getElementById('citySuggestions').style.display = 'none';
    }

    // Hide suggestions on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#city')) {
            document.getElementById('citySuggestions').style.display = 'none';
        }
    });

    // Resize confetti on window change (mobile-friendly)
    window.addEventListener('resize', () => {
        const canvas = document.getElementById('confetti');
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    });
});