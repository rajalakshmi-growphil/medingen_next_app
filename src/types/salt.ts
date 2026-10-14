export interface SaltComposition {
  composition: string;
  shortComposition?: string;
  slug?: string;
  uses?: string;
  sideEffects?: string;
  dosage?: string;
  description?: string;
}

export interface SaltDetailResponse {
  composition: string;
  details?: Record<string, unknown>;
  relatedCompositions?: SaltComposition[];
}
