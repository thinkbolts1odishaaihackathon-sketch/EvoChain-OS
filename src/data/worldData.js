/**
 * EvoChain-OS: Geographic Digital Twin & Simulation Vectors
 */

export const WORLD_HUBS = {
  shanghai: {
    id: 'shanghai',
    name: 'Port of Shanghai',
    city: 'Shanghai, China',
    type: 'seaport',
    role: 'Primary Export Mega-Hub',
    x: 0.810,
    y: 0.435,
    lat: 31.23,
    lng: 121.47,
    capacityTEU: 47300000,
    currentCongestion: 0.18,
    status: 'optimal'
  },
  singapore: {
    id: 'singapore',
    name: 'Port of Singapore',
    city: 'Singapore',
    type: 'transshipment',
    role: 'Global Transshipment Gateway',
    x: 0.772,
    y: 0.582,
    lat: 1.35,
    lng: 103.82,
    capacityTEU: 37500000,
    currentCongestion: 0.22,
    status: 'optimal'
  },
  busan: {
    id: 'busan',
    name: 'Port of Busan',
    city: 'Busan, South Korea',
    type: 'seaport',
    role: 'East Asia Transshipment Hub',
    x: 0.835,
    y: 0.410,
    lat: 35.18,
    lng: 129.08,
    capacityTEU: 22000000,
    currentCongestion: 0.15,
    status: 'optimal'
  },
  taipei: {
    id: 'taipei',
    name: 'Port of Kaohsiung / Taipei Hub',
    city: 'Taiwan',
    type: 'air_sea',
    role: 'Semiconductor Fabrication Corridor',
    x: 0.812,
    y: 0.468,
    lat: 25.03,
    lng: 121.56,
    capacityTEU: 10000000,
    currentCongestion: 0.12,
    status: 'optimal'
  },
  mumbai: {
    id: 'mumbai',
    name: 'JNPT Nhava Sheva',
    city: 'Mumbai, India',
    type: 'seaport',
    role: 'South Asia Trade Gateway',
    x: 0.690,
    y: 0.495,
    lat: 18.95,
    lng: 72.95,
    capacityTEU: 6000000,
    currentCongestion: 0.25,
    status: 'optimal'
  },
  jebel_ali: {
    id: 'jebel_ali',
    name: 'Jebel Ali Port',
    city: 'Dubai, UAE',
    type: 'seaport',
    role: 'Middle East Redistribution Hub',
    x: 0.645,
    y: 0.465,
    lat: 25.01,
    lng: 55.06,
    capacityTEU: 14000000,
    currentCongestion: 0.19,
    status: 'optimal'
  },
  rotterdam: {
    id: 'rotterdam',
    name: 'Port of Rotterdam',
    city: 'Rotterdam, Netherlands',
    type: 'seaport',
    role: 'Europe Core Gateway & Rhine Corridor',
    x: 0.505,
    y: 0.305,
    lat: 51.92,
    lng: 4.48,
    capacityTEU: 15300000,
    currentCongestion: 0.24,
    status: 'optimal'
  },
  hamburg: {
    id: 'hamburg',
    name: 'Port of Hamburg',
    city: 'Hamburg, Germany',
    type: 'seaport',
    role: 'Central / Northern Europe Railhead',
    x: 0.520,
    y: 0.290,
    lat: 53.55,
    lng: 9.99,
    capacityTEU: 8700000,
    currentCongestion: 0.20,
    status: 'optimal'
  },
  piraeus: {
    id: 'piraeus',
    name: 'Port of Piraeus',
    city: 'Athens, Greece',
    type: 'seaport',
    role: 'Mediterranean Entry Hub',
    x: 0.555,
    y: 0.380,
    lat: 37.94,
    lng: 23.64,
    capacityTEU: 5400000,
    currentCongestion: 0.17,
    status: 'optimal'
  },
  los_angeles: {
    id: 'los_angeles',
    name: 'Port of Los Angeles / Long Beach',
    city: 'California, USA',
    type: 'seaport',
    role: 'US West Coast Mega-Gateway',
    x: 0.175,
    y: 0.395,
    lat: 33.74,
    lng: -118.26,
    capacityTEU: 19000000,
    currentCongestion: 0.28,
    status: 'optimal'
  },
  new_york: {
    id: 'new_york',
    name: 'Port of New York & New Jersey',
    city: 'New York, USA',
    type: 'seaport',
    role: 'US East Coast Principal Hub',
    x: 0.285,
    y: 0.360,
    lat: 40.71,
    lng: -74.00,
    capacityTEU: 9500000,
    currentCongestion: 0.21,
    status: 'optimal'
  },
  santos: {
    id: 'santos',
    name: 'Port of Santos',
    city: 'Santos, Brazil',
    type: 'seaport',
    role: 'South America Mineral Hub',
    x: 0.360,
    y: 0.740,
    lat: -23.96,
    lng: -46.33,
    capacityTEU: 4800000,
    currentCongestion: 0.30,
    status: 'optimal'
  },
  cape_town: {
    id: 'cape_town',
    name: 'Port of Cape Town',
    city: 'South Africa',
    type: 'transit_refuel',
    role: 'Cape Route Transit & Bunkering',
    x: 0.542,
    y: 0.785,
    lat: -33.92,
    lng: 18.42,
    capacityTEU: 1000000,
    currentCongestion: 0.10,
    status: 'optimal'
  }
};

export const CHOKEPOINTS = {
  suez_canal: {
    id: 'suez_canal',
    name: 'Suez Canal & Red Sea',
    x: 0.582,
    y: 0.420,
    lat: 30.5,
    lng: 32.3,
    riskLevel: 0.15,
    flowRate: 50,
    status: 'open',
    vulnerability: 'Geopolitical / Missile & Drone Interdiction',
    affectedRoutes: ['asia_europe_suez']
  },
  bab_el_mandeb: {
    id: 'bab_el_mandeb',
    name: 'Bab el-Mandeb Strait',
    x: 0.612,
    y: 0.495,
    lat: 12.5,
    lng: 43.3,
    riskLevel: 0.20,
    flowRate: 48,
    status: 'open',
    vulnerability: 'High Drone / Anti-Ship Ballistic Threat Zone',
    affectedRoutes: ['asia_europe_suez']
  },
  malacca_strait: {
    id: 'malacca_strait',
    name: 'Strait of Malacca',
    x: 0.762,
    y: 0.565,
    lat: 2.2,
    lng: 102.2,
    riskLevel: 0.08,
    flowRate: 95,
    status: 'open',
    vulnerability: 'Extreme Traffic Density & Shallows Bottleneck',
    affectedRoutes: ['asia_europe_suez', 'asia_europe_cape']
  },
  panama_canal: {
    id: 'panama_canal',
    name: 'Panama Canal',
    x: 0.265,
    y: 0.530,
    lat: 9.1,
    lng: -79.7,
    riskLevel: 0.12,
    flowRate: 36,
    status: 'open',
    vulnerability: 'Gatun Lake Drought & Draft Restrictions',
    affectedRoutes: ['asia_us_east_panama']
  },
  taiwan_strait: {
    id: 'taiwan_strait',
    name: 'Taiwan Strait Corridor',
    x: 0.805,
    y: 0.455,
    lat: 24.5,
    lng: 119.8,
    riskLevel: 0.14,
    flowRate: 70,
    status: 'open',
    vulnerability: 'Typhoons & Geopolitical Air/Naval Tensions',
    affectedRoutes: ['transpacific_us_west', 'asia_europe_suez']
  },
  hormuz_strait: {
    id: 'hormuz_strait',
    name: 'Strait of Hormuz',
    x: 0.650,
    y: 0.455,
    lat: 26.5,
    lng: 56.3,
    riskLevel: 0.16,
    flowRate: 40,
    status: 'open',
    vulnerability: 'Oil & LNG Tanker Hazard',
    affectedRoutes: ['mideast_asia_crude']
  }
};

export const TRADE_LANES = [
  {
    id: 'asia_europe_suez',
    name: 'Silk Sea Corridor (via Suez)',
    waypoints: [
      { x: 0.810, y: 0.435 },
      { x: 0.772, y: 0.582 },
      { x: 0.690, y: 0.540 },
      { x: 0.612, y: 0.495 },
      { x: 0.582, y: 0.420 },
      { x: 0.535, y: 0.380 },
      { x: 0.470, y: 0.395 },
      { x: 0.475, y: 0.330 },
      { x: 0.505, y: 0.305 }
    ],
    mode: 'ocean',
    standardDays: 24,
    riskExposure: 'High (Chokepoint Sensitive)',
    fuelCostFactor: 1.0,
    carbonIndex: 100
  },
  {
    id: 'asia_europe_cape',
    name: 'Alternative Cape of Good Hope Route',
    waypoints: [
      { x: 0.810, y: 0.435 },
      { x: 0.772, y: 0.582 },
      { x: 0.680, y: 0.650 },
      { x: 0.580, y: 0.750 },
      { x: 0.542, y: 0.785 },
      { x: 0.460, y: 0.680 },
      { x: 0.430, y: 0.500 },
      { x: 0.450, y: 0.360 },
      { x: 0.505, y: 0.305 }
    ],
    mode: 'ocean_divert',
    standardDays: 36,
    riskExposure: 'Low (Deep Ocean)',
    fuelCostFactor: 1.42,
    carbonIndex: 135
  },
  {
    id: 'transpacific_us_west',
    name: 'Transpacific Express (Asia -> LA)',
    waypoints: [
      { x: 0.810, y: 0.435 },
      { x: 0.860, y: 0.390 },
      { x: 0.960, y: 0.360 },
      { x: 0.040, y: 0.360 },
      { x: 0.175, y: 0.395 }
    ],
    mode: 'ocean',
    standardDays: 14,
    riskExposure: 'Moderate',
    fuelCostFactor: 1.0,
    carbonIndex: 85
  },
  {
    id: 'transatlantic_eu_us',
    name: 'Transatlantic Corridor (Rotterdam -> NY)',
    waypoints: [
      { x: 0.505, y: 0.305 },
      { x: 0.470, y: 0.315 },
      { x: 0.380, y: 0.330 },
      { x: 0.285, y: 0.360 }
    ],
    mode: 'ocean',
    standardDays: 9,
    riskExposure: 'Low',
    fuelCostFactor: 0.85,
    carbonIndex: 60
  },
  {
    id: 'air_bridge_urgent',
    name: 'Emergency Global Air Express Corridor',
    waypoints: [
      { x: 0.812, y: 0.468 },
      { x: 0.645, y: 0.465 },
      { x: 0.505, y: 0.305 }
    ],
    mode: 'air',
    standardDays: 2.5,
    riskExposure: 'Minimal',
    fuelCostFactor: 5.8,
    carbonIndex: 320
  }
];

export const INITIAL_VESSELS = [
  {
    id: 'VSL-9821',
    name: 'CMA CGM Titan',
    type: 'Ultra Large Container Carrier',
    cargo: 'Advanced Semiconductors & AI Silicon Accelerators',
    cargoValueM: 420,
    teu: 21500,
    origin: 'shanghai',
    destination: 'rotterdam',
    currentRouteId: 'asia_europe_suez',
    progress: 0.42,
    speedKnots: 19.4,
    status: 'on_schedule',
    etaDays: 13.8,
    co2FootprintTons: 3840
  },
  {
    id: 'VSL-4042',
    name: 'Maersk Mc-Kinney',
    type: 'Triple-E Container Carrier',
    cargo: 'EV Lithium Cells & Solid-State Battery Packs',
    cargoValueM: 195,
    teu: 18270,
    origin: 'shanghai',
    destination: 'los_angeles',
    currentRouteId: 'transpacific_us_west',
    progress: 0.68,
    speedKnots: 20.8,
    status: 'on_schedule',
    etaDays: 4.5,
    co2FootprintTons: 2950
  },
  {
    id: 'VSL-7719',
    name: 'Ever Glory',
    type: 'Neopanamax Container Carrier',
    cargo: 'Automotive Radar Modules & ECU Microcontrollers',
    cargoValueM: 145,
    teu: 14800,
    origin: 'singapore',
    destination: 'rotterdam',
    currentRouteId: 'asia_europe_suez',
    progress: 0.28,
    speedKnots: 18.2,
    status: 'on_schedule',
    etaDays: 17.2,
    co2FootprintTons: 3100
  },
  {
    id: 'VSL-5520',
    name: 'MSC Oscar',
    type: 'Mega Container Carrier',
    cargo: 'Pharmaceutical Biologics & Cold-Chain APIs',
    cargoValueM: 310,
    teu: 19224,
    origin: 'mumbai',
    destination: 'rotterdam',
    currentRouteId: 'asia_europe_suez',
    progress: 0.35,
    speedKnots: 19.0,
    status: 'on_schedule',
    etaDays: 14.5,
    co2FootprintTons: 2700
  },
  {
    id: 'VSL-2190',
    name: 'Hapag-Lloyd Berlin',
    type: 'Bulk Mineral Carrier',
    cargo: 'Lithium Hydroxide Monohydrate & Copper Cathodes',
    cargoValueM: 88,
    teu: 13500,
    origin: 'santos',
    destination: 'rotterdam',
    currentRouteId: 'transatlantic_eu_us',
    progress: 0.55,
    speedKnots: 16.5,
    status: 'on_schedule',
    etaDays: 5.1,
    co2FootprintTons: 1980
  },
  {
    id: 'AIR-9901',
    name: 'Polar Air Express 777F',
    type: 'Heavy Intercontinental Air Cargo',
    cargo: 'Mission-Critical HBM3e Memory & Foundry Silicon',
    cargoValueM: 520,
    teu: 110,
    origin: 'taipei',
    destination: 'rotterdam',
    currentRouteId: 'air_bridge_urgent',
    progress: 0.72,
    speedKnots: 490,
    status: 'on_schedule',
    etaDays: 0.8,
    co2FootprintTons: 890
  }
];

export const INITIAL_MACRO_METRICS = {
  brentCrude: 78.40,
  crudeTrend: '+0.4%',
  freightIndexFBX: 2840,
  freightTrend: '+1.8%',
  semiConductorLeadWeeks: 22.4,
  semiTrend: '-0.2 wks',
  globalDisruptionIndex: 18.2,
  resilienceScore: 94.8,
  activeAutonomousDecisions: 184,
  estimatedCostSavedM: 34.8,
  carbonAbatedKiloTons: 12.4
};

export const DISRUPTION_SCENARIOS = {
  RED_SEA_MISSILE_CRISIS: {
    id: 'RED_SEA_MISSILE_CRISIS',
    title: 'Red Sea & Bab el-Mandeb Threat Interdiction',
    severity: 'CRITICAL',
    type: 'GEOPOLITICAL_WAR_RISK',
    targetChokepoint: 'bab_el_mandeb',
    targetRoute: 'asia_europe_suez',
    description: 'Autonomous drones and missile alerts reported in Bab el-Mandeb corridor. Marine war-risk insurance surcharges spike 520%. Suez transit delays exceed 14 days.',
    impacts: {
      chokepointRisk: 0.95,
      routePenaltyDays: 16,
      bunkerPriceSpike: +18.5,
      freightIndexSurge: +45.0,
      vesselRerouteRecommended: 'asia_europe_cape'
    }
  },
  TAIWAN_SUPER_TYPHOON: {
    id: 'TAIWAN_SUPER_TYPHOON',
    title: 'Super Typhoon Krathon in Taiwan Strait',
    severity: 'SEVERE',
    type: 'EXTREME_WEATHER_CLIMATE',
    targetChokepoint: 'taiwan_strait',
    targetRoute: 'transpacific_us_west',
    description: 'Category 5 Super Typhoon tracking across Taiwan Strait. Kaohsiung port operations shut down for 96h. Semiconductor foundries initiate protective logistics halt.',
    impacts: {
      chokepointRisk: 0.88,
      routePenaltyDays: 8,
      bunkerPriceSpike: +6.2,
      freightIndexSurge: +22.0,
      semiConductorLeadSpike: +6.0
    }
  },
  ROTTERDAM_STRIKE_DROUGHT: {
    id: 'ROTTERDAM_STRIKE_DROUGHT',
    title: 'Rhine Drought & Rotterdam Terminal Strike',
    severity: 'ELEVATED',
    type: 'INFRASTRUCTURE_LABOR',
    targetChokepoint: null,
    targetHub: 'rotterdam',
    description: 'Rhine inland barge capacity drops to 25% due to historic low water levels, accompanied by a 72-hour terminal dockworkers strike.',
    impacts: {
      hubCongestion: 0.85,
      dockDelayDays: 6,
      freightIndexSurge: +14.0
    }
  },
  CRUDE_OIL_SUPPLY_SHOCK: {
    id: 'CRUDE_OIL_SUPPLY_SHOCK',
    title: 'OPEC+ Surprise Curtailment & Bunker Fuel Spike',
    severity: 'HIGH_MACRO',
    type: 'MACRO_COMMODITY_SHOCK',
    targetChokepoint: 'hormuz_strait',
    description: 'Coordinated 2.2M bpd crude production cut triggers immediate 38% surge in VLSFO marine bunker fuel and aviation jet fuel.',
    impacts: {
      chokepointRisk: 0.72,
      bunkerPriceSpike: +38.0,
      freightIndexSurge: +31.0
    }
  },
  suez_red_sea_blockade: {
    id: 'suez_red_sea_blockade',
    title: 'Red Sea & Bab el-Mandeb Threat Interdiction',
    severity: 'CRITICAL',
    type: 'GEOPOLITICAL_WAR_RISK',
    targetChokepoint: 'bab_el_mandeb',
    targetRoute: 'asia_europe_suez',
    description: 'Autonomous drones and missile alerts reported in Bab el-Mandeb corridor. Marine war-risk insurance surcharges spike 520%. Suez transit delays exceed 14 days.',
    impacts: {
      chokepointRisk: 0.95,
      routePenaltyDays: 16,
      bunkerPriceSpike: +18.5,
      freightIndexSurge: +45.0,
      vesselRerouteRecommended: 'asia_europe_cape'
    }
  }
};
