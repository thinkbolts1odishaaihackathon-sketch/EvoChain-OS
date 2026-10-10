"""
EvoChain-OS: Pydantic Data Contracts & Schemas
Enterprise data structures for the self-evolving AI agent supply chain network.
"""

from typing import List, Dict, Optional, Literal
from pydantic import BaseModel, Field
from datetime import datetime

class GeoCoord(BaseModel):
    x: float = Field(..., description="Normalized X coordinate [0, 1]")
    y: float = Field(..., description="Normalized Y coordinate [0, 1]")
    lat: Optional[float] = None
    lng: Optional[float] = None

class PortHub(BaseModel):
    id: str
    name: str
    city: str
    hub_type: Literal['seaport', 'transshipment', 'air_sea', 'transit_refuel']
    role: str
    coords: GeoCoord
    capacity_teu: int
    current_congestion: float = Field(0.0, ge=0.0, le=1.0)
    status: Literal['optimal', 'congested', 'disrupted'] = 'optimal'

class Chokepoint(BaseModel):
    id: str
    name: str
    coords: GeoCoord
    risk_level: float = Field(0.0, ge=0.0, le=1.0)
    flow_rate: int
    status: Literal['open', 'restricted', 'disrupted'] = 'open'
    vulnerability_description: str
    affected_routes: List[str]

class TradeLane(BaseModel):
    id: str
    name: str
    waypoints: List[GeoCoord]
    mode: Literal['ocean', 'ocean_divert', 'rail', 'air']
    standard_days: float
    risk_exposure: str
    fuel_cost_factor: float
    carbon_index: float

class Vessel(BaseModel):
    id: str
    name: str
    vessel_type: str
    cargo: str
    cargo_value_usd_m: float
    teu_capacity: int
    origin: str
    destination: str
    current_route_id: str
    progress: float = Field(0.0, ge=0.0, le=1.0)
    speed_knots: float
    status: Literal['on_schedule', 'autonomously_rerouted', 'delayed', 'docked'] = 'on_schedule'
    eta_days: float
    co2_footprint_tons: float
    reroute_details: Optional[Dict] = None

class MacroIndicators(BaseModel):
    brent_crude_usd: float
    crude_trend: str
    freight_index_fbx: float
    freight_trend: str
    semiconductor_lead_weeks: float
    semi_trend: str
    global_disruption_index: float
    resilience_score: float
    active_autonomous_decisions: int
    estimated_cost_saved_usd_m: float
    carbon_abated_kilotons: float

class AgentMessage(BaseModel):
    id: str
    timestamp: str
    sender: str
    sender_name: str
    target: str
    message_type: str
    thought_trace: str
    payload: Dict
    confidence: float = 0.95

class PolicyGenome(BaseModel):
    generation: int
    fitness_score: float
    anomaly_sigma_threshold: float
    air_bridge_threshold_usd_per_teu: float
    safety_buffer_multiplier: float
    fiduciary_escrow_cap_usd_m: float
    bunker_hedging_sensitivity: float
    prompt_mutation_instruction: str

# ==========================================
# Security & Authentication Models
# ==========================================
class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=120, description="Full Name of the Operator")
    email: str = Field(..., min_length=4, max_length=180, description="Enterprise Email Address")
    password: str = Field(..., min_length=6, description="Password (salted with bcrypt)")
    role: Optional[str] = Field("EXECUTIVE_ARBITER", description="Requested Role: EXECUTIVE_ARBITER, RISK_AUDITOR, or GUEST_JUDGE")
    title: Optional[str] = Field("Supply Chain Director", description="Corporate Title / Position")

class LoginRequest(BaseModel):
    email: Optional[str] = Field(None, description="Enterprise user email")
    username_or_email: Optional[str] = Field(None, description="Alternative username or email identifier")
    password: Optional[str] = Field(default="", description="Operator password")
    profile_id: Optional[str] = Field(None, description="1-Click RBAC Profile selector")
    role_hint: Optional[str] = Field(None, description="Requested RBAC role")

class PasskeyVerifyRequest(BaseModel):
    profile_id: Optional[str] = Field("usr-judge", description="Target profile ID")
    user_id: Optional[str] = None
    client_nonce: Optional[str] = Field(None, description="Anti-replay challenge nonce")
    signature: Optional[str] = Field(None, description="Biometric enclave attestation signature")

class EscrowAuthRequest(BaseModel):
    vessel_id: str = Field("VSL-9821", description="Target vessel identifier")
    amount_m: Optional[float] = Field(None, ge=0.0, le=100.0, description="Escrow capital in millions USD")
    amount_usd_m: Optional[float] = Field(None, ge=0.0, le=100.0, description="Escrow capital in millions USD")
    purpose: str = Field("REROUTE_BUNKER_ESCROW", description="Financial commitment purpose")

class DisruptionSimulationRequest(BaseModel):
    title: str = Field("Red Sea Missile Alert", max_length=120)
    severity: float = Field(0.92, ge=0.0, le=1.0)

class SecurityAuditEntry(BaseModel):
    index: int
    id: str
    timestamp: str
    event_type: str
    severity: str
    user_id: str
    ip_address: str
    details: Dict[str, Any]
    prev_hash: str
    hash: str

class SecurityStatusResponse(BaseModel):
    status: str
    jwt_algorithm: str
    has_bcrypt: bool
    total_audit_entries: int
    revoked_tokens_count: int
    chain_integrity_valid: bool
    timestamp: str
