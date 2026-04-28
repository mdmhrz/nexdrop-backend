import { ParcelType, ServiceType } from "../../../../generated/prisma/enums";

// ── Configurable rate table ───────────────────────────────────────────────────

const BASE_RATES: Record<ServiceType, { sameDistrict: number; interDistrict: number }> = {
    [ServiceType.STANDARD]: { sameDistrict: 60, interDistrict: 120 },
    [ServiceType.EXPRESS]: { sameDistrict: 110, interDistrict: 200 },
};

const TYPE_SURCHARGES: Record<ParcelType, number> = {
    [ParcelType.DOCUMENT]: 0,
    [ParcelType.SMALL]: 0,
    [ParcelType.MEDIUM]: 20,
    [ParcelType.LARGE]: 50,
    [ParcelType.FRAGILE]: 50,
    [ParcelType.ELECTRONICS]: 70,
};

const WEIGHT_FREE_KG = 1;        // first 1 kg is included in base
const RATE_PER_EXTRA_KG = 15;    // ৳ per kg above the free threshold

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PricingInput {
    weight: number;
    parcelType: ParcelType;
    serviceType: ServiceType;
    districtFrom: string;
    districtTo: string;
}

export interface PricingResult {
    price: number;
    breakdown: {
        base: number;
        typeSurcharge: number;
        weightSurcharge: number;
    };
}

// ── Calculation ───────────────────────────────────────────────────────────────

export function calculateParcelPrice(input: PricingInput): PricingResult {
    const { weight, parcelType, serviceType, districtFrom, districtTo } = input;

    const isSameDistrict = districtFrom.trim().toLowerCase() === districtTo.trim().toLowerCase();

    const base = isSameDistrict
        ? BASE_RATES[serviceType].sameDistrict
        : BASE_RATES[serviceType].interDistrict;

    const typeSurcharge = TYPE_SURCHARGES[parcelType];

    const extraKg = Math.max(0, weight - WEIGHT_FREE_KG);
    const weightSurcharge = Math.ceil(extraKg) * RATE_PER_EXTRA_KG;

    const price = base + typeSurcharge + weightSurcharge;

    return {
        price,
        breakdown: { base, typeSurcharge, weightSurcharge },
    };
}
