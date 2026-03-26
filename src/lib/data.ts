/**
 * Static data for the Bomach Group website.
 * All images are served from /images/ in the public directory.
 * This replaces the API calls that previously fetched from the Django backend.
 */

import type {
  HomepageData,
  Service,
  ServiceDetail,
  SubService,
  Project,
  ProjectDetail,
  Blog,
  BlogDetail,
  Employee,
  AboutData,
  Job,
  JobDetail,
  Product,
  Partner,
  HomeSlider,
  CustomerReview,
} from "./types";

// ── Property Categories & Sub-Categories ──

export const PROPERTY_CATEGORIES: Record<string, string[]> = {
  "Land": ["Residential Land", "Commercial Land", "Industrial Land", "Agricultural Land", "Mixed-Use Land"],
  "House": ["Detached Duplex", "Semi-Detached Duplex", "Terraced Duplex", "Bungalow", "Mansion", "Penthouse", "Flat/Apartment"],
  "Commercial": ["Office Space", "Shop/Retail", "Warehouse", "Hotel", "Plaza/Mall", "Event Center"],
  "Estate": ["Residential Estate", "Commercial Estate", "Mixed-Use Estate", "Gated Community"],
  "Industrial": ["Factory", "Warehouse", "Workshop", "Processing Plant"],
};

// ── Nigerian States & Cities ──

export const NIGERIAN_STATES_CITIES: Record<string, string[]> = {
  "Abia": ["Aba", "Umuahia", "Ohafia", "Arochukwu", "Bende", "Igbere", "Isuikwuato"],
  "Adamawa": ["Yola", "Mubi", "Numan", "Jimeta", "Ganye", "Michika", "Hong"],
  "Akwa Ibom": ["Uyo", "Eket", "Ikot Ekpene", "Oron", "Abak", "Ikot Abasi", "Etinan", "Ibiono-Ibom"],
  "Anambra": ["Awka", "Onitsha", "Nnewi", "Ekwulobia", "Obosi", "Ihiala", "Oba", "Nkpor", "Aguleri", "Ogbaru"],
  "Bauchi": ["Bauchi", "Azare", "Misau", "Jama'are", "Katagum", "Alkaleri", "Ningi"],
  "Bayelsa": ["Yenagoa", "Ogbia", "Brass", "Sagbama", "Amassoma", "Nembe", "Ekeremor"],
  "Benue": ["Makurdi", "Otukpo", "Gboko", "Katsina-Ala", "Vandeikya", "Zaki-Biam", "Adler"],
  "Borno": ["Maiduguri", "Biu", "Bama", "Dikwa", "Monguno", "Gwoza", "Ngala"],
  "Cross River": ["Calabar", "Ogoja", "Ikom", "Obudu", "Akamkpa", "Ugep", "Yakurr", "Obubra"],
  "Delta": ["Asaba", "Warri", "Sapele", "Agbor", "Ughelli", "Ogwashi-Uku", "Kwale", "Abraka", "Ibusa", "Ozoro", "Oleh"],
  "Ebonyi": ["Abakaliki", "Afikpo", "Onueke", "Ishiagu", "Ezza", "Ikwo", "Izzi"],
  "Edo": ["Benin City", "Auchi", "Ekpoma", "Uromi", "Igarra", "Okada", "Sabongida-Ora", "Irrua"],
  "Ekiti": ["Ado-Ekiti", "Ikere-Ekiti", "Ilawe-Ekiti", "Efon-Alaaye", "Ikole-Ekiti", "Ijero-Ekiti", "Omuo-Ekiti"],
  "Enugu": ["Enugu", "Nsukka", "Agbani", "Udi", "Oji River", "9th Mile", "Obollo-Afor", "Awgu"],
  "FCT": ["Abuja", "Gwagwalada", "Kuje", "Bwari", "Kwali", "Kubwa", "Lugbe", "Nyanya", "Karu", "Jikwoyi"],
  "Gombe": ["Gombe", "Billiri", "Kaltungo", "Bajoga", "Dukku", "Yamaltu-Deba"],
  "Imo": ["Owerri", "Orlu", "Okigwe", "Oguta", "Mbaise", "Ehime-Mbano", "Ideato", "Mbaitoli"],
  "Jigawa": ["Dutse", "Hadejia", "Gumel", "Kazaure", "Kafin Hausa", "Ringim", "Babura"],
  "Kaduna": ["Kaduna", "Zaria", "Kafanchan", "Kagoro", "Mando", "Rigasa", "Barnawa", "Sabon Tasha"],
  "Kano": ["Kano", "Wudil", "Gwarzo", "Rano", "Ungogo", "Kumbotso", "Tarauni", "Nassarawa"],
  "Katsina": ["Katsina", "Daura", "Funtua", "Malumfashi", "Mani", "Kazaure", "Baure"],
  "Kebbi": ["Birnin Kebbi", "Argungu", "Yauri", "Zuru", "Jega", "Bagudo", "Bunza"],
  "Kogi": ["Lokoja", "Okene", "Idah", "Kabba", "Ankpa", "Anyigba", "Egbe"],
  "Kwara": ["Ilorin", "Offa", "Jebba", "Lafiagi", "Omu-Aran", "Kaiama", "Patigi"],
  "Lagos": ["Lagos", "Ikeja", "Lekki", "Ibeju-Lekki", "Victoria Island", "Ikoyi", "Ajah", "Sangotedo", "Epe", "Badagry", "Ikorodu", "Surulere", "Yaba", "Apapa", "Oshodi", "Mushin", "Agege", "Alimosho", "Abule-Egba"],
  "Nasarawa": ["Lafia", "Keffi", "Akwanga", "Nasarawa", "Karu", "Mararaba"],
  "Niger": ["Minna", "Bida", "Suleja", "Kontagora", "New Bussa", "Lapai"],
  "Ogun": ["Abeokuta", "Sagamu", "Ijebu-Ode", "Ota", "Ilaro", "Ifo", "Mowe", "Ibafo", "Redemption Camp", "Agbara"],
  "Ondo": ["Akure", "Ondo", "Owo", "Ikare", "Okitipupa", "Ore", "Idanre"],
  "Osun": ["Osogbo", "Ile-Ife", "Ilesa", "Ede", "Ejigbo", "Ikire", "Ikirun", "Iwo"],
  "Oyo": ["Ibadan", "Ogbomoso", "Oyo", "Iseyin", "Saki", "Eruwa"],
  "Plateau": ["Jos", "Bukuru", "Pankshin", "Shendam", "Mangu", "Barkin Ladi", "Langtang"],
  "Rivers": ["Port Harcourt", "Obio-Akpor", "Bonny", "Degema", "Eleme", "Ahoada", "Omoku", "Oyigbo", "Isiokpo"],
  "Sokoto": ["Sokoto", "Tambuwal", "Bodinga", "Gwadabawa", "Wurno", "Goronyo"],
  "Taraba": ["Jalingo", "Wukari", "Bali", "Takum", "Gashaka", "Kurmi"],
  "Yobe": ["Damaturu", "Potiskum", "Gashua", "Nguru", "Geidam"],
  "Zamfara": ["Gusau", "Kaura Namoda", "Talata Mafara", "Anka"],
};

export const NIGERIAN_STATES = Object.keys(NIGERIAN_STATES_CITIES);

// ── Hero Sliders ──

export const sliders: HomeSlider[] = [
  {
    id: 1,
    big_text: "Your Trusted Partner for Success",
    small_text:
      "With decades of experience and a team of industry professionals, we are committed to delivering optimum output and efficient results.",
    image_url: "/images/hero/bomach-hero-success.png",
    priority: 1,
  },
  {
    id: 2,
    big_text: "Experience Excellence",
    small_text:
      "We are your one-stop solution for real estate services, land services, civil engineering services and construction, digital innovation, and food production.",
    image_url: "/images/hero/bomach-real4.jpg",
    priority: 2,
  },
  {
    id: 3,
    big_text: "Building the Future Together",
    small_text:
      "Comprehensive solutions across real estate, engineering, digital innovation, and more.",
    image_url: "/images/hero/bomach-it.jpg",
    priority: 3,
  },
];

// ── Services ──

export const services: Service[] = [
  {
    id: 1,
    name: "Real Estate Services",
    slug: "real-estate-services",
    image_url: "/images/services/real-estate.jpg",
    rating: 98,
    priority: 1,
    date: "2023-01-01",
  },
  {
    id: 2,
    name: "Civil Engineering Services",
    slug: "civil-engineering-services",
    image_url: "/images/services/construction.jpg",
    rating: 96,
    priority: 2,
    date: "2023-01-01",
  },
  {
    id: 3,
    name: "Land Services",
    slug: "land-services",
    image_url: "/images/services/engineering1.jpg",
    rating: 94,
    priority: 3,
    date: "2023-01-01",
  },
  {
    id: 4,
    name: "Web Development / Business Automation",
    slug: "web-development-business-automation",
    image_url: "/images/services/web-dev.jpg",
    rating: 100,
    priority: 4,
    date: "2023-01-01",
  },
  {
    id: 5,
    name: "Logistics and Courier Services",
    slug: "logistics-and-courier-services",
    image_url: "/images/services/logistics.jpg",
    rating: 98,
    priority: 5,
    date: "2023-01-01",
  },
  {
    id: 6,
    name: "Food and Farms",
    slug: "food-and-farms",
    image_url: "/images/services/engineering2.jpg",
    rating: 96,
    priority: 6,
    date: "2023-01-01",
  },
];

export const subServices: Record<number, SubService[]> = {
  1: [
    { id: 1, name: "Estate Development", slug: "estate-development", image_url: "/images/estates/bethel-city/1.jpg", content: "We develop premium estates with modern amenities and secure environments.", rating: 98, priority: 1, date: "2023-01-01" },
    { id: 2, name: "Buy or Sell Properties", slug: "buy-or-sell-properties", image_url: "/images/estates/cornerstone/1.jpg", content: "Expert guidance in buying and selling residential and commercial properties.", rating: 96, priority: 2, date: "2023-01-01" },
    { id: 3, name: "Interior Design", slug: "interior-design", image_url: "/images/estates/cornerstone/3.jpg", content: "Transform your spaces with our professional interior design services.", rating: 94, priority: 3, date: "2023-01-01" },
    { id: 4, name: "Renovation", slug: "renovation", image_url: "/images/estates/civil-engineering/1.jpg", content: "Complete renovation services to modernize and enhance your property.", rating: 100, priority: 4, date: "2023-01-01" },
  ],
  2: [
    { id: 5, name: "Analysis and Design", slug: "analysis-and-design", image_url: "/images/services/construction.jpg", content: "Structural analysis and design services for safe and efficient buildings.", rating: 98, priority: 1, date: "2023-01-01" },
    { id: 6, name: "Structural Detailing", slug: "structural-detailing", image_url: "/images/estates/civil-engineering/2.jpg", content: "Detailed structural plans and drawings for construction projects.", rating: 96, priority: 2, date: "2023-01-01" },
    { id: 7, name: "Building and Construction", slug: "building-and-construction", image_url: "/images/estates/civil-engineering/3.jpg", content: "Full-scale building and construction services for residential and commercial projects.", rating: 98, priority: 3, date: "2023-01-01" },
  ],
  3: [
    { id: 8, name: "Land Survey", slug: "land-survey", image_url: "/images/estates/land-services/1.jpg", content: "Professional land surveying services for accurate property boundaries and mapping.", rating: 96, priority: 1, date: "2023-01-01" },
    { id: 9, name: "Land Documentation", slug: "land-documentation", image_url: "/images/services/engineering1.jpg", content: "Complete land documentation services including C of O processing.", rating: 94, priority: 2, date: "2023-01-01" },
  ],
  4: [
    { id: 10, name: "Web Development", slug: "web-development", image_url: "/images/services/web-dev.jpg", content: "Custom web development and business automation solutions.", rating: 100, priority: 1, date: "2023-01-01" },
  ],
  5: [
    { id: 11, name: "Logistics", slug: "logistics", image_url: "/images/services/logistics.jpg", content: "Efficient logistics and courier services for businesses.", rating: 98, priority: 1, date: "2023-01-01" },
  ],
  6: [
    { id: 12, name: "Cassava Production and Processing", slug: "cassava-production", image_url: "/images/services/engineering2.jpg", content: "Large-scale cassava production and processing operations.", rating: 96, priority: 1, date: "2023-01-01" },
    { id: 13, name: "Bakery", slug: "bakery", image_url: "/images/services/engineering2.jpg", content: "Commercial bakery operations and distribution.", rating: 98, priority: 2, date: "2023-01-01" },
  ],
};

export const serviceDetails: Record<string, ServiceDetail> = {};
services.forEach((s) => {
  serviceDetails[s.slug] = {
    ...s,
    content: `<p>${s.name} — Bomach Group provides comprehensive ${s.name.toLowerCase()} with a commitment to quality and excellence.</p>`,
    sub_services: subServices[s.id] || [],
  };
});

// ── Projects ──

export const projects: Project[] = [
  { id: 1, name: "Bethel City Estate", slug: "bethel-city-estate", image_url: "/images/projects/bethel-city.jpg", sub_service_name: "Estate Development", priority: 1, date: "2023-07-01" },
  { id: 2, name: "City of David Estate", slug: "city-of-david-estate", image_url: "/images/estates/city-of-david/1.jpg", sub_service_name: "Estate Development", priority: 2, date: "2023-06-29" },
  { id: 3, name: "Corner Stone City Estate", slug: "corner-stone-city-estate", image_url: "/images/estates/cornerstone/1.jpg", sub_service_name: "Estate Development", priority: 3, date: "2023-08-17" },
  { id: 4, name: "4 Bedroom Bungalow", slug: "4-bedroom-bungalow", image_url: "/images/projects/project2.jpg", sub_service_name: "Buy or Sell Properties", priority: 4, date: "2023-06-29" },
  { id: 5, name: "Modern 4-Bedroom Duplex", slug: "modern-4-bedroom-duplex", image_url: "/images/projects/project3.jpg", sub_service_name: "Building and Construction", priority: 5, date: "2023-06-29" },
  { id: 6, name: "2 Blocks of 3-Bedroom Flats", slug: "2-blocks-3-bedroom-flats", image_url: "/images/projects/project4.jpg", sub_service_name: "Building and Construction", priority: 6, date: "2023-06-29" },
  { id: 7, name: "Perimeter Survey", slug: "perimeter-survey", image_url: "/images/estates/land-services/1.jpg", sub_service_name: "Land Services", priority: 7, date: "2023-06-28" },
  { id: 8, name: "1km Hydraulic Construction", slug: "1km-hydraulic-construction", image_url: "/images/estates/civil-engineering/1.jpg", sub_service_name: "Building and Construction", priority: 8, date: "2023-07-05" },
];

export const projectDetails: Record<string, ProjectDetail> = {};
projects.forEach((p) => {
  projectDetails[p.slug] = {
    ...p,
    content: `<p>${p.name} — A project by Bomach Group showcasing our expertise in ${p.sub_service_name || "construction"}.</p>`,
  };
});

// ── Blogs ──

export const blogs: Blog[] = [
  {
    id: 1,
    title: "Real Estate Investment Trust",
    slug: "real-estate-investment-trust",
    author: "Bomach Group",
    image_url: "/images/blogs/real-estate-portfolio.jpg",
    short_content: "A Real Estate Investment Trust (REIT) is a company that owns, operates, or finances income-generating real estate properties, allowing individual investors to participate in large-scale ventures.",
    priority: 1,
    date: "2023-10-13",
  },
  {
    id: 2,
    title: "Before You Build",
    slug: "before-you-build",
    author: "Bomach Group",
    image_url: "/images/blogs/before-you-build.jpg",
    short_content: "Are you thinking of bringing that dream project to life? You must know these essential preparation steps first before breaking ground.",
    priority: 2,
    date: "2023-07-01",
  },
  {
    id: 3,
    title: "Ensuring Structural Safety: The Importance of Professional Analysis and Design",
    slug: "ensuring-structural-safety",
    author: "Bomach Group",
    image_url: "/images/blogs/structural-safety.jpg",
    short_content: "Structural safety is a critical aspect of any construction project. Professional analysis and design are essential for achieving reliable, safe structures.",
    priority: 3,
    date: "2023-07-27",
  },
  {
    id: 4,
    title: "Introducing Bethel City Estate: Your Perfect Investment Opportunity in Enugu",
    slug: "introducing-bethel-city-estate",
    author: "Bomach Group",
    image_url: "/images/blogs/bethel-city-estate.jpg",
    short_content: "Discover Bethel City Estate in Enugu — an investment opportunity that combines affordability, rapid appreciation, and world-class amenities in a serene environment.",
    priority: 4,
    date: "2023-06-22",
  },
  {
    id: 5,
    title: "The Dynamic Trends Surrounding Real Estate in Nigeria",
    slug: "the-dynamic-trends-surrounding-real-estate-in-nigeria",
    author: "Bomach Group",
    image_url: "/images/blogs/real-estate-trends-nigeria.jpg",
    short_content: "Nigeria's real estate sector is shaped by dual market forces — demand for affordable housing alongside growing interest in luxury residential and commercial properties.",
    priority: 5,
    date: "2023-06-21",
  },
];

export const blogDetails: Record<string, BlogDetail> = {
  "real-estate-investment-trust": {
    id: 1,
    title: "Real Estate Investment Trust",
    slug: "real-estate-investment-trust",
    author: "Bomach Group",
    image_url: "/images/blogs/real-estate-portfolio.jpg",
    priority: 1,
    date: "2023-10-13",
    content: `
      <p>A Real Estate Investment Trust (REIT) is a company or financial institution that owns, operates, or finances income-generating real estate properties. REITs provide a way for individual investors to earn a share of the income produced through commercial real estate ownership — without actually having to go out and buy, manage, or finance any properties themselves. By pooling the capital of numerous investors, a REIT makes it possible for individual investors to participate in substantial real estate ventures and access dividends from real estate investments without having to buy, manage, or finance any property directly.</p>

      <h2>Key Advantages of Investing in REITs</h2>

      <p><strong>Liquidity:</strong> One of the primary advantages of REITs is their liquidity. Since many REITs are publicly traded on major stock exchanges, investors can buy and sell REIT shares with ease, similar to trading stocks. This stands in stark contrast to traditional real estate investments, which can be illiquid and time-consuming to sell. The ability to quickly convert REIT shares into cash provides investors with greater flexibility and access to their funds when needed.</p>

      <p><strong>Diversification:</strong> Investing in REITs allows individuals to diversify their investment portfolios beyond traditional asset classes like stocks and bonds. REITs often hold a diverse range of properties across different sectors, including residential, commercial, industrial, and healthcare. This diversification can help mitigate risk by spreading investments across various property types and geographic locations, reducing the impact of any single property's poor performance on the overall portfolio.</p>

      <p><strong>Income Generation:</strong> REITs are required by law to distribute at least 90% of their taxable income to shareholders in the form of dividends. As a result, REITs often offer attractive dividend yields, making them an appealing option for income-seeking investors. These regular dividend payments can provide a steady stream of passive income, which can be particularly beneficial for retirees or those looking to supplement their existing income sources.</p>

      <p><strong>Professional Management:</strong> REITs are managed by experienced real estate professionals who possess in-depth knowledge of the industry. These management teams are responsible for property acquisition, development, leasing, maintenance, and overall portfolio strategy. By investing in a REIT, individuals can benefit from the expertise of seasoned professionals without the need to personally oversee property management, tenant relations, or maintenance — all of which require significant time and specialized knowledge.</p>

      <p><strong>Transparency:</strong> Publicly traded REITs are subject to regulatory oversight and are required to provide detailed financial disclosures to investors and the public. This transparency enables investors to make well-informed decisions based on accurate and up-to-date information about the REIT's performance, holdings, and management strategies. This level of disclosure goes beyond what is typically available for direct real estate investments, giving REIT investors greater confidence in their holdings.</p>

      <p><strong>Tax Benefits:</strong> REITs can offer certain tax advantages to investors. In many jurisdictions, REITs enjoy corporate-level tax exemptions, provided they meet specific criteria such as distributing a significant portion of their income to shareholders. This tax-efficient structure can enhance the overall returns for investors, as a greater portion of the income generated by the REIT's properties flows through to the shareholders rather than being absorbed by corporate taxes.</p>

      <h2>Types of REITs</h2>

      <p>There are three main categories of REITs that investors should understand. <strong>Equity REITs</strong> own and manage income-producing real estate properties — they generate revenue primarily through collecting rent from tenants and managing their real estate holdings. <strong>Mortgage REITs</strong>, on the other hand, focus on the financing side of real estate — they provide funding for real estate transactions and earn income from the interest on mortgage loans and mortgage-backed securities. <strong>Hybrid REITs</strong> combine both approaches, owning and operating properties while simultaneously investing in mortgages and mortgage-backed securities, giving investors exposure to both income streams.</p>

      <h2>Conclusion</h2>

      <p>Real Estate Investment Trusts offer investors a unique opportunity to participate in the real estate market with numerous benefits, including liquidity, diversification, income generation, professional management, transparency, and potential tax advantages. Whether you are a seasoned investor looking to diversify your portfolio or a newcomer seeking exposure to the real estate market, REITs present an attractive and accessible investment option. However, as with any investment, it's essential to conduct thorough research and consider your own financial situation and goals before making any investment decisions. By doing so, you can make the most of the opportunities that REITs have to offer.</p>
    `,
  },
  "before-you-build": {
    id: 2,
    title: "Before You Build",
    slug: "before-you-build",
    author: "Bomach Group",
    image_url: "/images/blogs/before-you-build.jpg",
    priority: 2,
    date: "2023-07-01",
    content: `
      <p>Are you thinking of bringing that dream project to life? You must know these things first. Whether it's a residential home, a commercial building, or an infrastructure project, adequate preparation before breaking ground is what separates successful builds from costly disasters. Here are the essential steps every builder and property developer should follow.</p>

      <h2>A. Plan Your Project</h2>
      <ul>
        <li>Clearly define your goals and objectives for the project — know exactly what you want to achieve before you begin.</li>
        <li>Determine the scope of work and create a detailed plan that covers timelines, budgets, and milestones.</li>
        <li>Research and obtain all necessary permits and approvals from relevant local authorities to avoid legal complications later.</li>
      </ul>

      <h2>B. Conduct Necessary Tests</h2>
      <p>Before any construction begins, it is critical to perform comprehensive soil assessments and other relevant geotechnical tests. These tests help ensure that the soil bearing capacity is right for your project and allow you to provide for any required reinforcements. Skipping this step can lead to foundation failures, structural settling, and other problems that are extremely expensive to fix after construction has begun. Invest in proper testing upfront — it will save you far more in the long run.</p>

      <h2>C. Assess Resources and Materials</h2>
      <ul>
        <li>Take a thorough inventory of all tools, equipment, and materials needed for the project.</li>
        <li>Ensure that all necessary resources are available or make arrangements to acquire them before work begins.</li>
        <li>Verify the quality and suitability of materials for the specific project requirements — substandard materials lead to substandard structures.</li>
      </ul>

      <h2>D. Prepare the Workspace</h2>
      <ul>
        <li>Clear the site of any debris, vegetation, old structures, or hazards that could interfere with construction.</li>
        <li>Ensure there is adequate space for construction activities, material staging, equipment access, and worker movement.</li>
        <li>Implement preliminary safety measures including site fencing, signage, and basic protective infrastructure.</li>
      </ul>

      <h2>E. Review Safety Guidelines</h2>
      <ul>
        <li>Familiarize yourself and your team with all relevant safety protocols and regulations that apply to your project type.</li>
        <li>Identify potential hazards specific to your project — whether they relate to height, excavation, electrical work, or heavy machinery.</li>
        <li>Ensure all team members are properly trained on emergency procedures, first aid, and safe working practices before a single brick is laid.</li>
      </ul>

      <h2>F. Communicate and Coordinate</h2>
      <ul>
        <li>Establish clear roles and responsibilities for every person involved in the project from architects to laborers.</li>
        <li>Set up effective and reliable communication channels that keep all stakeholders informed and aligned.</li>
        <li>Address any concerns, questions, or potential conflicts before construction starts — not during it.</li>
      </ul>

      <h2>G. Double-Check Plans</h2>
      <ul>
        <li>Conduct a final review of all blueprints, engineering drawings, and project specifications for completeness and accuracy.</li>
        <li>Verify all measurements, material specifications, and structural calculations one more time.</li>
        <li>If anything seems unclear or uncertain, seek professional advice before proceeding — it is always cheaper to fix an error on paper than on the construction site.</li>
      </ul>

      <h2>H. Start with Small-Scale Testing</h2>
      <p>For particularly complex or novel elements of your project, consider conducting small-scale tests or building prototypes first. This approach allows you to identify potential problems, test material compatibility, and refine your approach while the stakes are still low. Discovering issues during a small test is far preferable to discovering them in the middle of full-scale construction.</p>

      <h2>Conclusion</h2>
      <p>Proper preparation is not just a nice-to-have — it is the foundation upon which every successful construction project is built. By taking the time to plan, test, coordinate, and verify before you begin, you dramatically reduce the risk of costly mistakes, dangerous incidents, and frustrating delays. Remember, the goal is to build right the first time. For professional guidance and expert support on your next construction project, contact Bomach Group — we are here to help you build with confidence and excellence.</p>
    `,
  },
  "ensuring-structural-safety": {
    id: 3,
    title: "Ensuring Structural Safety: The Importance of Professional Analysis and Design",
    slug: "ensuring-structural-safety",
    author: "Bomach Group",
    image_url: "/images/blogs/structural-safety.jpg",
    priority: 3,
    date: "2023-07-27",
    content: `
      <p>Structural safety is a critical aspect of any construction project, whether it involves towering skyscrapers, expansive bridges, or humble residential buildings. The safety and well-being of the people who live, work, and travel within these structures depend on the integrity of their design. In this article, we explore the importance of professional structural analysis and design, and why they should never be overlooked or taken for granted.</p>

      <img src="/images/blogs/structural-safety-inline.jpg" alt="Professional structural analysis in progress" />

      <h2>Understanding Structural Analysis</h2>
      <p>Structural analysis is the process of evaluating the behavior and performance of a building or infrastructure under various loads and conditions. Engineers employ advanced software tools and sophisticated mathematical models to predict how different materials and structural components will respond to external forces — including gravity, wind loads, seismic activity, and the stresses of daily occupancy. Through detailed analysis, engineers can anticipate not only the effects of anticipated loads but also the impact of unforeseen events such as earthquakes, hurricanes, or severe weather events. This proactive approach allows them to design structures that can withstand a wide range of scenarios while maintaining their integrity.</p>

      <h2>The Vital Role of Structural Design</h2>
      <p>Structural design works hand-in-hand with structural analysis. It is the creative and technical process of developing safe, efficient, and aesthetically pleasing structures while ensuring full compliance with building codes and regulations. During the design phase, engineers carefully consider material selection, construction methodologies, architectural requirements, and long-term performance characteristics. A well-executed structural design not only meets safety standards but also optimizes material usage and reduces construction costs — delivering better value without sacrificing structural integrity or occupant safety.</p>

      <h2>Ensuring Public Safety</h2>
      <p>Perhaps the most compelling reason for investing in professional structural analysis and design is the direct impact on public safety. History provides sobering reminders of what happens when structural engineering is compromised. The catastrophic Hyatt Regency walkway collapse in Kansas City in 1981 and the devastating Morandi Bridge failure in Genoa, Italy in 2018 are stark examples of how design and construction failures can lead to tragic loss of life. These disasters reinforce a fundamental truth: inadequate structural engineering puts lives at risk, and no amount of cost savings is worth that gamble.</p>

      <h2>Compliance with Building Codes and Regulations</h2>
      <p>Professional structural engineers possess deep knowledge of local, national, and international building codes and regulations. These codes exist to establish minimum safety standards that protect the public, and they are continually updated to reflect new knowledge and technologies. Non-compliance with building codes can result in severe legal consequences, project shutdowns, and — most importantly — endanger the lives of building occupants and the general public. By engaging qualified structural professionals, project owners can be confident that their buildings meet or exceed all applicable regulatory requirements.</p>

      <h2>Adapting to Changing Conditions</h2>
      <p>Our world is constantly changing, and structures must be designed with resilience and adaptability in mind. Climate change is bringing stronger hurricanes, more frequent flooding, prolonged droughts, and other environmental challenges that buildings and infrastructure must be able to withstand. Professional structural analysis incorporates these evolving conditions into the design process, leveraging innovative engineering solutions, new materials, and sustainable design practices. By accounting for future conditions today, engineers help ensure that the structures we build remain safe and functional for decades to come.</p>

      <h2>Sustainability and Cost-Effectiveness</h2>
      <p>An often overlooked benefit of professional structural design is its contribution to sustainability and cost-effectiveness. Well-designed structures optimize material usage and construction methods, minimizing waste and reducing the environmental footprint of the building process. Additionally, structures that are properly designed from the outset require less maintenance and fewer repairs over their lifetime, resulting in significant long-term cost savings for building owners and operators. Investing in quality design upfront pays dividends for years to come.</p>

      <h2>Conclusion</h2>
      <p>Professional structural analysis and design are not optional extras — they are essential investments in the safety, durability, and sustainability of our built environment. They safeguard public safety, ensure compliance with building codes, enable adaptation to changing environmental conditions, and promote cost-effective, sustainable construction practices. As we continue to build and develop our communities, let us prioritize structural safety by engaging qualified professionals who have the expertise and commitment to protect lives and build a more resilient future for everyone.</p>
    `,
  },
  "introducing-bethel-city-estate": {
    id: 4,
    title: "Introducing Bethel City Estate: Your Perfect Investment Opportunity in Enugu",
    slug: "introducing-bethel-city-estate",
    author: "Bomach Group",
    image_url: "/images/blogs/bethel-city-estate.jpg",
    priority: 4,
    date: "2023-06-22",
    content: `
      <p>We are thrilled to introduce Bethel City Estate, the latest landmark project from Bomach Group, nestled in the serene and rapidly developing heart of Enugu. This exceptional estate is designed to offer the perfect blend of affordability, modern facilities, and a friendly living environment — making it an outstanding opportunity for astute investors and homebuyers alike. Whether you are seeking your first property investment or looking to expand your portfolio, Bethel City Estate represents a smart choice with excellent growth potential.</p>

      <p>One of the most compelling reasons to invest in Bethel City Estate is its remarkable affordability. At Bomach Group, we understand that the financial aspect of property investment is paramount, and we have worked diligently to ensure that our estate offers competitive pricing without cutting corners on quality. We are committed to striking the perfect balance between your financial goals and the quality of the property you receive. Every aspect of Bethel City Estate has been carefully planned and executed to deliver maximum value, ensuring that your investment appreciates rapidly while meeting the highest standards of construction and design.</p>

      <p>But affordability does not mean sacrificing luxury or comfort. Bethel City Estate has been thoughtfully designed to provide residents with a truly enriching lifestyle. The estate features a state-of-the-art gym and fitness center for health-conscious residents, a beautiful swimming pool for relaxation and recreation, a dedicated children's play area where families can create lasting memories, and meticulously landscaped gardens that provide a sense of tranquility and natural beauty throughout the community. Every home within the estate is well-designed and spacious, reflecting our commitment to creating living spaces that residents will love coming home to.</p>

      <p>The strategic location of Bethel City Estate near Centenary City Enugu is another significant advantage for investors. This area is experiencing rapid development and growth, with new businesses, infrastructure projects, and amenities being established at an impressive pace. Investing in property within this corridor positions you to benefit from strong property value appreciation as the area continues to mature and attract both residential and commercial interest. The potential for high returns on investment makes Bethel City Estate not just a home, but a gateway to wealth creation and future business opportunities.</p>

      <p>Beyond the financial and material benefits, Bethel City Estate offers something truly precious — a serene, tranquil environment that feels like a world away from the hustle and bustle of city life. Imagine waking up to the melodious chirping of birds and the gentle rustling of leaves, surrounded by nature's beauty while still maintaining convenient access to all essential amenities, transportation links, and urban conveniences. This is the lifestyle that awaits you at Bethel City Estate — a perfect balance of peaceful living and modern connectivity.</p>

      <p>As a Bomach Group project, Bethel City Estate carries with it our unwavering commitment to quality, reliability, and customer satisfaction. Our track record in property development speaks for itself, and we stand behind every project we deliver with pride and integrity. When you invest with Bomach Group, you are not just buying property — you are partnering with a trusted name that has consistently delivered on its promises. Your investment is secure, your property is built to last, and your returns are positioned for growth.</p>

      <p>Don't miss out on this incredible opportunity to be part of Enugu's finest real estate development. Contact Bomach Group today to book your spot in Bethel City Estate and take the first confident step toward securing your financial future. The opportunity is here, the timing is right, and the potential is extraordinary.</p>
    `,
  },
  "the-dynamic-trends-surrounding-real-estate-in-nigeria": {
    id: 5,
    title: "The Dynamic Trends Surrounding Real Estate in Nigeria",
    slug: "the-dynamic-trends-surrounding-real-estate-in-nigeria",
    author: "Bomach Group",
    image_url: "/images/blogs/real-estate-trends-nigeria.jpg",
    priority: 5,
    date: "2023-06-21",
    content: `
      <p>The real estate landscape in Nigeria is marked by dynamic and evolving trends that continue to shape the industry in fascinating ways. One of the most significant trends is the simultaneous demand for affordable housing and properties within the cities, alongside the growing market for luxury residential and commercial properties in major urban centers such as Lagos, FCT Abuja, and Enugu. These cities present attractive investment opportunities with the potential for very high returns on investment, drawing both domestic and international buyers into the market.</p>

      <p>Several powerful forces are driving these trends. Nigeria's rapidly growing population continues to create sustained demand for housing across all price segments. People across different economic classes need flexible housing options that match their circumstances and aspirations — from affordable starter homes to premium luxury estates. Foreign investment is also playing an increasingly important role, with international capital flowing into both commercial and residential developments across the country's major cities. Additionally, economic fluctuations have led many Nigerians to view real estate as a guaranteed means of appreciation and a reliable hedge against inflation, particularly when returns from the banking sector prove inadequate for meaningful wealth preservation and growth.</p>

      <p>At Bomach Shelters and Properties, we have positioned ourselves strategically at the intersection of these market forces. Our mission is to bridge the gap between affordability and quality, serving both ends of the market spectrum within Enugu's vibrant urban landscape. We understand that every buyer has different needs and different budgets, and we are committed to ensuring that exceptional property is accessible to all.</p>

      <p>For buyers seeking cost-effective solutions, we offer properties that deliver outstanding quality and comfort at accessible price points. Our affordable developments are designed with the same attention to detail and construction standards as our premium offerings — because we believe that well-built, thoughtfully designed homes should not be a privilege reserved only for the wealthy. Every family deserves a quality living environment, and our developments reflect that commitment.</p>

      <p>For those seeking luxury and exclusivity, our high-end properties feature premium finishes, sophisticated amenities, and spacious designs that cater to the most discerning buyers. These properties are crafted to provide an elevated living experience that meets the expectations of clients who demand nothing but the best in terms of design, comfort, and prestige.</p>

      <p>One of the most compelling advantages of investing in Enugu real estate is the city's exceptional strategic positioning. With multiple access routes and well-maintained road networks, residents can enjoy convenient connectivity and quick commutes to work, schools, healthcare facilities, and recreational destinations throughout the city and beyond. This accessibility, combined with Enugu's well-earned reputation for safety and tranquility, makes it an increasingly attractive destination for property investment.</p>

      <p>Property values in Enugu continue to show strong and consistent appreciation, rewarding investors who had the foresight to enter the market early. As infrastructure development accelerates, more businesses establish a presence in the region, and the population continues to grow, this upward trajectory in property values is expected to continue well into the future. For those considering real estate investment in Nigeria, Enugu presents a compelling combination of affordability, growth potential, and quality of life that is hard to match. Contact Bomach Group today through our website to explore the opportunities that await you.</p>
    `,
  },
};

// ── Team / Employees ──

export const employees: Employee[] = [
  { id: 1, name: "Tochukwu David", job_title: "CEO", image_url: "/images/team/ceo-tochukwu.jpg", facebook: null, twitter: null, instagram: null, priority: 1 },
  { id: 2, name: "George Arinze", job_title: "CTO", image_url: "/images/team/cto-george.jpg", facebook: null, twitter: null, instagram: null, priority: 2 },
  { id: 3, name: "Ozioma Ogbozor", job_title: "Marketing Manager", image_url: "/images/team/marketing-ozioma.jpg", facebook: null, twitter: null, instagram: null, priority: 3 },
  { id: 4, name: "Caleb Chinedu", job_title: "Civil Engineer", image_url: "/images/team/engineer-caleb.jpg", facebook: null, twitter: null, instagram: null, priority: 4 },
  { id: 5, name: "Gideon Chukwuoma", job_title: "Software Engineer", image_url: "/images/team/dev-gideon.jpg", facebook: null, twitter: null, instagram: null, priority: 5 },
  { id: 6, name: "Emmanuel Nwaegunwa", job_title: "Software Engineer", image_url: "/images/team/dev-emmanuel.jpg", facebook: null, twitter: null, instagram: null, priority: 6 },
];

// ── Partners ──

export const partners: Partner[] = [
  { id: 1, company: "KS", image_url: "/images/partners/ks.jpg", priority: 1 },
  { id: 2, company: "FS", image_url: "/images/partners/fs.jpg", priority: 2 },
  { id: 3, company: "BR", image_url: "/images/partners/br.jpg", priority: 3 },
  { id: 4, company: "MC", image_url: "/images/partners/mc.jpg", priority: 4 },
  { id: 5, company: "MK", image_url: "/images/partners/mk.jpg", priority: 5 },
  { id: 6, company: "PC", image_url: "/images/partners/pc.jpg", priority: 6 },
  { id: 7, company: "TJ", image_url: "/images/partners/tj.jpg", priority: 7 },
  { id: 8, company: "VC", image_url: "/images/partners/vc.jpg", priority: 8 },
];

// ── Reviews ──

export const reviews: CustomerReview[] = [
  { id: 1, name: "Mr Kalu", occupation: "Business Man", review: "I am truly impressed with Bomach Shelters and Properties Ltd. You guys really surprised me. Your expertise in designing and constructing my 4-bedroom building was outstanding. From start to finish, you exceeded my expectations and delivered an exceptional result.", priority: 1, date: "2023-06-01" },
  { id: 2, name: "Mr Obiukwu Henry", occupation: "Business Man", review: "I am delighted to share my incredible experience with Bomach Shelters and Properties Ltd. Their expertise and dedication in designing and constructing my dream home were truly exceptional.", priority: 2, date: "2023-06-02" },
  { id: 3, name: "Emeka Udemezue", occupation: "Programmer", review: "I am extremely satisfied with the land I purchased from Bomach Shelters and Properties Ltd. The location, infrastructure, and amenities in their estate exceeded my expectations. The entire buying process was seamless.", priority: 3, date: "2023-06-03" },
  { id: 4, name: "Jonathan Wilfred", occupation: "Entrepreneur", review: "Choosing you guys for my land purchase was the best decision I made. Their estate offers a serene and secure environment that is perfect for building my dream home.", priority: 4, date: "2023-06-04" },
  { id: 5, name: "Amalu Somto", occupation: "Banker", review: "I cannot express enough how satisfied I am with the house renovation services provided by Bomach Shelters and Properties Ltd. They paid meticulous attention to every detail.", priority: 5, date: "2023-06-05" },
  { id: 6, name: "Mr Agbo James", occupation: "Transporter", review: "I had a fantastic experience with Bomach Shelters and Properties Ltd when it came to handling my property documents. They guided me through the documentation process.", priority: 6, date: "2023-06-06" },
  { id: 7, name: "Mrs Ifeoma Okonkwo", occupation: "Business Owner", review: "I would like to express my gratitude to Bomach Shelters and Properties Ltd for their exceptional land surveying services. Their team demonstrated great expertise and professionalism.", priority: 7, date: "2023-06-07" },
  { id: 8, name: "Madueke Harrison", occupation: "System Analyst", review: "I am absolutely delighted to share my extraordinary experience with Bomach Shelters and Properties Ltd. They impeccably developed my 6-bedroom duplex at City of David.", priority: 8, date: "2023-06-08" },
  { id: 9, name: "Engr Nze", occupation: "Engineer", review: "I am extremely pleased with the building drawing services provided by Bomach Shelters and Properties Ltd. As an engineer, I highly value precision and attention to detail, and Bomach surpassed my expectations.", priority: 9, date: "2023-06-09" },
  { id: 10, name: "Emmanuel Max", occupation: "Business Man", review: "I bought a land with them and they served me well.", priority: 10, date: "2023-06-10" },
];

// ── Jobs ──

export const jobs: Job[] = [
  { id: 1, title: "Marketer", slug: "marketer", location: "Enugu", job_type: "Full-time", salary_range: null, image_url: "/images/jobs/marketer.jpg", deadline: "2026-01-30", is_active: true, priority: 1, date: "2025-11-04" },
  { id: 2, title: "Digital Marketer", slug: "digital-marketer", location: "Enugu", job_type: "Full-time", salary_range: null, image_url: "/images/jobs/digital-marketer.jpg", deadline: "2026-01-30", is_active: true, priority: 2, date: "2025-11-04" },
  { id: 3, title: "Civil Engineer", slug: "civil-engineer", location: "Enugu", job_type: "Full-time", salary_range: null, image_url: "/images/jobs/civil-engineer.jpg", deadline: "2025-11-20", is_active: true, priority: 3, date: "2025-11-04" },
  { id: 4, title: "Surveyor", slug: "surveyor", location: "Enugu", job_type: "Full-time", salary_range: null, image_url: "/images/jobs/surveyor.jpg", deadline: "2025-11-20", is_active: true, priority: 4, date: "2025-11-05" },
  { id: 5, title: "Business Development Manager", slug: "business-development-manager", location: "Enugu", job_type: "Full-time", salary_range: null, image_url: "/images/jobs/biz-dev-1.jpg", deadline: null, is_active: true, priority: 5, date: "2025-11-05" },
  { id: 6, title: "Videographer / Video Editor", slug: "videographer-video-editor", location: "Enugu", job_type: "Full-time", salary_range: null, image_url: "/images/jobs/capture.jpg", deadline: null, is_active: true, priority: 6, date: "2025-11-17" },
  { id: 7, title: "Mobile App Developer (Flutter)", slug: "mobile-app-developer-flutter", location: "Enugu (Onsite)", job_type: "Full-time", salary_range: null, image_url: "/images/jobs/biz-dev-2.jpg", deadline: null, is_active: true, priority: 7, date: "2025-11-18" },
  { id: 8, title: "Full-Stack Developer (Python)", slug: "full-stack-developer", location: "Enugu (Onsite)", job_type: "Full-time", salary_range: null, image_url: "/images/jobs/biz-dev-3.jpg", deadline: null, is_active: true, priority: 8, date: "2025-11-18" },
  { id: 9, title: "HR Manager", slug: "hr-manager", location: "Enugu", job_type: "Full-time", salary_range: null, image_url: "/images/jobs/biz-dev-4.jpg", deadline: null, is_active: true, priority: 9, date: "2025-11-18" },
];

export const jobDetails: Record<string, JobDetail> = {};
jobs.forEach((j) => {
  jobDetails[j.slug] = {
    ...j,
    description: `<p>We are looking for a talented ${j.title} to join our team at Bomach Group in ${j.location}.</p>`,
    requirements: "<p>Relevant experience and qualifications in the field.</p>",
    responsibilities: `<p>Key responsibilities for the ${j.title} role at Bomach Group.</p>`,
    benefits: "<p>Competitive salary, professional development opportunities, and a dynamic work environment.</p>",
  };
});

// ── Products (from services page — products are service-linked) ──

export const products: Product[] = [];

// ── Aggregated Data ──

export const homepageData: HomepageData = {
  sliders,
  services,
  products_by_service: [],
  projects,
  blogs,
  reviews,
  partners,
  employees_count: 24,
  project_count: 39,
  happy_customer_count: 53,
};

export const aboutData: AboutData = {
  employees,
  partners,
  employees_count: 24,
  project_count: 39,
  happy_customer_count: 53,
};
