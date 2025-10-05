const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export async function getAffiliates(
  page: number = 1,
  limit: number = 20,
) {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', limit.toString());

    const response = await fetch(`${baseUrl}/api/affiliates?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch affiliates');
    }

    return response.json();
};

export async function registerAffiliate(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any,
) {
    const response = await fetch(`${baseUrl}/api/affiliates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        throw new Error('Failed to register affiliate');
    }

    return response.json();
}
