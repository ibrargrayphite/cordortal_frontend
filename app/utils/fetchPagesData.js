// utils/fetchPagesData.js
let cachedPagesData = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchPagesData() {
  const currentDomain = process.env.NEXT_PUBLIC_DOMAIN;
  const now = Date.now();

  // Check if cache is valid
  if (cachedPagesData && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedPagesData;
  }

  try {
    console.log('Fetching pages data for domain:', currentDomain);
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/template/pages/?domain=${currentDomain}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    cachedPagesData = await response.json();
    cacheTimestamp = now;
    console.log('Pages data cached successfully');
    
    return cachedPagesData;
  } catch (error) {
    console.error('Error fetching pages data:', error);
    // Return cached data if available, even if expired
    if (cachedPagesData) {
      console.log('Returning cached data due to fetch error');
      return cachedPagesData;
    }
    // Return empty object if no cache available
    return {};
  }
}

// Function to clear cache if needed
export const clearPagesDataCache = () => {
  cachedPagesData = null;
  cacheTimestamp = null;
};