import type { RegisterAffiliateInput } from "myguardcare-affiliates-types";
import { handleApiResponse } from "./error";

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export async function getAffiliates(
  page: number = 1,
  limit: number = 20,
  filterByDni?: string,
) {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', limit.toString());

    if (filterByDni && filterByDni.trim() !== '') {
      params.set('filterByDni', filterByDni.trim());
    }

    const response = await fetch(`${baseUrl}/api/affiliates?${params.toString()}`);
    return handleApiResponse(response);
};

export async function registerAffiliate(
  body: RegisterAffiliateInput,
) {
    const response = await fetch(`${baseUrl}/api/affiliates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return handleApiResponse(response);
}
