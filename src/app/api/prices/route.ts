import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const res = await fetch('https://data-asg.goldprice.org/dbXRates/USD', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/json'
            },
            next: { revalidate: 10 } // Cache for 10 seconds
        });

        if (!res.ok) {
            throw new Error(`External API responded with ${res.status}`);
        }

        const data = await res.json();

        // Inject mock Platinum and Diamond prices (provider only gives Gold/Silver)
        if (data.items && data.items.length > 0) {
            data.items[0].xptPrice = 980.20 + (Math.random() * 2); // Mock Platinum fluctuation
            data.items[0].diaPrice = 5450.00 + (Math.random() * 50); // Mock Diamond per carat fluctuation
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching prices:', error);
        // Fallback mock data in case API fails
        return NextResponse.json({
            items: [{
                xauPrice: 2025.50,
                xagPrice: 24.50,
                xptPrice: 980.20,
                diaPrice: 5450.00,
                curr: 'USD'
            }]
        });
    }
}
