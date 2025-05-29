import { Nanogram, Testimonial } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const apiKey: string | undefined = process.env.API_KEY;

// ==================
// Nanogram Functions
// ==================
// Get nanograms for the hero section
export async function getHeroNanograms(): Promise<Nanogram[]> {
    try {
        const response = await fetch(`${BASE_URL}/api/nanogram?core=true&sort=priority&order=1&limit=9`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey || '',
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
export async function getTestimonials(): Promise<Testimonial[]> {
    try {
        const response = await fetch(`${BASE_URL}/api/nanogram?alumini=true&content=true&sort=priority&order=1`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey || '',
            },
            next: {
                revalidate: 60 // 1 minute
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.documents.map((doc: Testimonial) => ({
        id: doc._id,
        name: doc.name || "Anonymous",
        role: doc.role || "N/A",
        content: doc.content,
        avatarUrl: doc.avatarUrl || "/assets/images/placeholder.png", // Default placeholder
      }));
        
    } catch (error) {
        console.error("Error fetching testimonials:", error);
        return [];
    }
}