import { Nanogram } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function getHeroNanograms(): Promise<Nanogram[]> {
    try {
        const response = await fetch(`${BASE_URL}/api/nanogram?core=true&sort=priority&order=1&limit=9`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            next: {
                revalidate: 86400 // 24 hours
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.documents as Nanogram[];
        
    } catch (error) {
        console.error("Error fetching hero nanograms:", error);
        return [];
    }
}