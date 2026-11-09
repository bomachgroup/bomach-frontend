export type CampaignContentSource = 'site' | 'backend'

export type PublicLeadQuestion = {
  key: string
  label: string
  field_type: string
  required: boolean
  options: Array<string | { value: string; label: string }>
  help_text?: string
  sort_order: number
  is_active: boolean
}

export type PublicLeadForm = {
  public_key: string
  name: string
  source: string
  questions: PublicLeadQuestion[]
}

export type CampaignPageContent = {
  slug: string
  eyebrow: string
  headline: string
  subheadline: string
  description: string
  location: string
  plot_size_sqm: number
  standard_price: string | number
  promotion_price: string | number
  promotion_limit: number
  bonus_blocks: number
  bonus_text: string
  hero_image_url: string
  social_title: string
  social_description: string
  social_image_url: string
  contact_phone: string
  contact_whatsapp: string
  proximity: string[]
  features: string[]
  lead_form?: PublicLeadForm
}

export type CampaignLandingData = {
  source: CampaignContentSource
  content: CampaignPageContent | null
  leadForm: PublicLeadForm | null
  unavailable: boolean
}

export const fortressCitySiteContent: CampaignPageContent = {
  slug: 'fortress-city',
  eyebrow: 'FORTRESS CITY ESTATE · EMENE, ENUGU',
  headline: 'Your dream home deserves a strong start.',
  subheadline: 'Own a 500 sqm plot in a developing neighbourhood and take the first step towards building.',
  description: [
    'Fortress City Estate is a residential development in Emene, Enugu, offering 500 sqm plots.',
    'The campaign materials list the title as R of O. The estate is described as ready to build, with perimeter fencing, a good road network and drainage, electricity infrastructure, and a secure community.',
    'Nearby points listed are Peace Land Medical College (5 minutes), Eke Obiagu (7 minutes), Coal City (9 minutes), and Enugu Airport (15 minutes). Peaceland University, Satellite Estate, and Vanguard City Estate are also listed nearby.',
  ].join('\n\n'),
  location: 'Emene, Enugu',
  plot_size_sqm: 500,
  standard_price: '10000000.00',
  promotion_price: '7500000.00',
  promotion_limit: 10,
  bonus_blocks: 100,
  bonus_text: '100 free building blocks with every plot purchase',
  hero_image_url: '/images/campaigns/fortress-city-promo.jpg',
  social_title: 'Fortress City Estate, Emene | Buy, Build & Live',
  social_description: 'Secure a 500 sqm plot at Fortress City Estate, Emene, for ₦7.5 million. First 10 plots qualify for the promotional price, with 100 free building blocks with every plot purchase.',
  social_image_url: '/images/campaigns/fortress-city-promo.jpg',
  contact_phone: '+234 803 665 6173',
  contact_whatsapp: '+2348036656173',
  proximity: [
    '5 minutes from Peace Land Medical College',
    '7 minutes from Eke Obiagu',
    '9 minutes from Coal City',
    '15 minutes from Enugu Airport',
    'Nearby: Peaceland University, Satellite Estate, and Vanguard City Estate',
  ],
  features: [
    'Title: R of O',
    'Ready to build',
    'Perimeter fencing',
    'Good road network and drainage',
    'Electricity infrastructure',
    'Secure community',
  ],
}

export function getCampaignContentSource(): CampaignContentSource {
  return process.env.CAMPAIGN_CONTENT_SOURCE === 'backend' ? 'backend' : 'site'
}

function backendApiBase() {
  const configured = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL
  const fallback = process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:8000'
    : 'https://backend.bomachgroup.com'
  const value = configured && /^https?:\/\//i.test(configured) ? configured : fallback
  const origin = value.replace(/\/api(?:\/v1)?\/?$/i, '').replace(/\/$/, '')
  return `${origin}/api/v1`
}

async function fetchBackend<T>(path: string): Promise<T> {
  const response = await fetch(`${backendApiBase()}${path}`, {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) throw new Error(`Campaign service returned HTTP ${response.status}.`)
  return response.json() as Promise<T>
}

export async function loadCampaignLandingData(
  slug = 'fortress-city',
): Promise<CampaignLandingData> {
  const source = getCampaignContentSource()
  if (source === 'backend') {
    try {
      const content = await fetchBackend<CampaignPageContent>(
        `/public/campaign-pages/${encodeURIComponent(slug)}`,
      )
      return {
        source,
        content,
        leadForm: content.lead_form || null,
        unavailable: false,
      }
    } catch {
      return { source, content: null, leadForm: null, unavailable: true }
    }
  }

  let leadForm: PublicLeadForm | null = null
  try {
    leadForm = await fetchBackend<PublicLeadForm>(
      `/public/campaign-pages/${encodeURIComponent(slug)}/lead-form`,
    )
  } catch {
    // The approved site copy remains available when only lead capture is offline.
  }

  return {
    source,
    content: fortressCitySiteContent,
    leadForm,
    unavailable: false,
  }
}
