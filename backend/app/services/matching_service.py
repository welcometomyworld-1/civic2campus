import math
import logging
from datetime import datetime
from typing import Optional, Dict, Any, List, Tuple
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException, status

from app.models.user import UserRole, AccountStatus
from app.models.matching import TargetType, MatchStatus, ScoreBreakdown, MatchDocument
from app.schemas.user import UserProfileResponse
from app.schemas.matching import (
    MatchResponse,
    ProblemRecommendationResponse,
    ExpressInterestRequest,
    RejectMatchRequest,
)
from app.services.ai_service import AIService
from app.utils.security import hash_password

logger = logging.getLogger("civic2campus.matching_service")


# =============================================================================
# SEED DATA FOR JHARKHAND UNIVERSITIES & CSR INDUSTRY SPONSORS
# =============================================================================
SEED_UNIVERSITIES = [
    {
        "name": "Birla Institute of Technology, Mesra",
        "organization_name": "Birla Institute of Technology, Mesra",
        "email": "innovator@bitmesra.ac.in",
        "contact_person": "Dr. Rajiv Ranjan",
        "phone": "+91 94311 23456",
        "department": "Department of Computer Science & Engineering",
        "university_type": "CFTI / Deemed University",
        "city": "Ranchi",
        "state": "Jharkhand",
        "location": "Mesra, Ranchi, Jharkhand",
        "latitude": 23.4123,
        "longitude": 85.4399,
        "expertise": ["AI / ML", "IoT & Sensor Telemetry", "Environmental Engineering", "Clean Water Tech", "Robotics & Drones"],
        "domains": ["Groundwater Contamination & Filtration", "Solar Powered Smart Water ATMs", "Real-time pH/TDS Telemetry Nodes", "Clean Energy"],
        "status": AccountStatus.ACTIVE.value,
        "is_verified": True,
        "verification_status": "Approved"
    },
    {
        "name": "IIT (ISM) Dhanbad",
        "organization_name": "Indian Institute of Technology (ISM) Dhanbad",
        "email": "rnd.lead@iitism.ac.in",
        "contact_person": "Prof. Arun Kumar",
        "phone": "+91 94311 77889",
        "department": "Department of Environmental Science & Engineering",
        "university_type": "Institute of National Importance (IIT)",
        "city": "Dhanbad",
        "state": "Jharkhand",
        "location": "Dhanbad, Jharkhand",
        "latitude": 23.8143,
        "longitude": 86.4412,
        "expertise": ["Civil & Structural Engineering", "Environmental Engineering", "IoT & Sensor Telemetry", "Renewable Energy", "Data Science"],
        "domains": ["Modular Sustainable Construction", "Predictive Asset Monitoring", "Air Quality Telemetry", "Heavy Waste Recycling"],
        "status": AccountStatus.ACTIVE.value,
        "is_verified": True,
        "verification_status": "Approved"
    },
    {
        "name": "NIT Jamshedpur",
        "organization_name": "National Institute of Technology Jamshedpur",
        "email": "innovate@nitjsr.ac.in",
        "contact_person": "Dr. Priyanka Murmu",
        "phone": "+91 98351 11223",
        "department": "Department of Mechanical & Electronics Engineering",
        "university_type": "National Institute of Technology (NIT)",
        "city": "Jamshedpur",
        "state": "Jharkhand",
        "location": "Adityapur, Jamshedpur, Jharkhand",
        "latitude": 22.7770,
        "longitude": 86.1441,
        "expertise": ["Mechanical Automation", "AI Computer Vision", "Civil Engineering", "Biogas Generation", "Embedded Systems"],
        "domains": ["Automated Waste Segregation using AI Vision", "Anaerobic Composting Digestion", "Smart Irrigation", "Municipal Waste"],
        "status": AccountStatus.ACTIVE.value,
        "is_verified": True,
        "verification_status": "Approved"
    },
    {
        "name": "Birsa Agricultural University",
        "organization_name": "Birsa Agricultural University (BAU Ranchi)",
        "email": "agri.innovate@bauranchi.org",
        "contact_person": "Dr. D. K. Mahto",
        "phone": "+91 94311 33445",
        "department": "Faculty of Agriculture & Precision Engineering",
        "university_type": "State Agricultural University",
        "city": "Ranchi",
        "state": "Jharkhand",
        "location": "Kanke, Ranchi, Jharkhand",
        "latitude": 23.4358,
        "longitude": 85.3218,
        "expertise": ["Agronomy", "IoT Soil Telemetry", "Drone Robotics", "Solar Power Systems", "Agriculture Tech"],
        "domains": ["Soil Moisture Micro-irrigation Automation", "AI Crop Disease Classification", "Solar Pump Scheduling", "Crop Health"],
        "status": AccountStatus.ACTIVE.value,
        "is_verified": True,
        "verification_status": "Approved"
    }
]

SEED_INDUSTRIES = [
    {
        "name": "Tata Steel CSR Foundation",
        "company_name": "Tata Steel CSR Foundation",
        "email": "csr.jharkhand@tatasteel.com",
        "contact_person": "Sunil Verma",
        "designation": "Head of CSR & Rural Infrastructure",
        "phone": "+91 98351 98765",
        "industry_type": "Manufacturing, Clean Infrastructure & Mining",
        "city": "Jamshedpur",
        "state": "Jharkhand",
        "location": "Jamshedpur Works, Jharkhand",
        "latitude": 22.8046,
        "longitude": 86.2029,
        "expertise": ["Infrastructure", "Clean Water Tech", "Environmental Engineering", "Manufacturing", "IoT & Sensor Telemetry"],
        "support_available": ["Funding", "CSR Grants", "Mentorship", "Hardware & Sensor Kits", "Testing Labs & Fabrication"],
        "status": AccountStatus.ACTIVE.value,
        "is_verified": True,
        "verification_status": "Approved"
    },
    {
        "name": "Jindal Steel & Power CSR Foundation",
        "company_name": "Jindal Steel & Power CSR Foundation",
        "email": "csr.support@jindalsteel.com",
        "contact_person": "Rajesh Singhania",
        "designation": "State CSR Director",
        "phone": "+91 98351 44556",
        "industry_type": "Renewable Power & Steel Infrastructure",
        "city": "Ranchi",
        "state": "Jharkhand",
        "location": "Patratu / Ranchi, Jharkhand",
        "latitude": 23.6300,
        "longitude": 85.3100,
        "expertise": ["Renewable Energy", "Civil Infrastructure", "Clean Energy", "Solar Power Systems"],
        "support_available": ["Funding", "CSR Grants", "Solar Power Toolkits", "Engineering Mentorship"],
        "status": AccountStatus.ACTIVE.value,
        "is_verified": True,
        "verification_status": "Approved"
    },
    {
        "name": "Central Coalfields Limited (CCL CSR Directorate)",
        "company_name": "Central Coalfields Limited (CCL CSR)",
        "email": "ccl.csr@coalindia.in",
        "contact_person": "Shri M. K. Soren",
        "designation": "General Manager (CSR & Community Development)",
        "phone": "+91 94311 99001",
        "industry_type": "Public Sector Mining & Community Infrastructure",
        "city": "Ranchi",
        "state": "Jharkhand",
        "location": "Darbhanga House, Ranchi, Jharkhand",
        "latitude": 23.3700,
        "longitude": 85.3300,
        "expertise": ["Environmental Engineering", "Clean Water Tech", "Civil Infrastructure", "Public Health"],
        "support_available": ["Funding", "Solar Water ATMs", "CSR Grants", "Panchayat Infrastructure"],
        "status": AccountStatus.ACTIVE.value,
        "is_verified": True,
        "verification_status": "Approved"
    }
]


class MatchingEngine:
    """
    Transparent Multi-Factor Problem-to-Squad & Problem-to-CSR Matching Engine.
    Computes mathematically rigorous capability alignment.
    """

    # Configurable Scoring Weights (Sums to 100%)
    WEIGHT_EXPERTISE = 40.0  # 40%
    WEIGHT_DOMAIN = 20.0     # 20%
    WEIGHT_TECH = 15.0       # 15%
    WEIGHT_LOCATION = 10.0   # 10%
    WEIGHT_KEYWORD = 10.0    # 10%
    WEIGHT_CAPACITY = 5.0    # 5%

    @staticmethod
    def _calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """
        Calculates straight-line distance in kilometers between two GPS coordinates.
        """
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (
            math.sin(dlat / 2)**2
            + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
        )
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return 6371.0 * c

    @staticmethod
    def _normalize_set(items: List[str]) -> set:
        normalized = set()
        for item in items:
            clean = "".join([c.lower() if c.isalnum() else " " for c in item])
            for word in clean.split():
                if len(word) > 2 and word not in {"and", "the", "for", "with", "tech", "engineering", "systems"}:
                    normalized.add(word)
        return normalized

    @classmethod
    def compute_match_score(
        cls,
        problem: Dict[str, Any],
        ai_analysis: Dict[str, Any],
        organization: Dict[str, Any],
        target_type: TargetType
    ) -> Tuple[float, ScoreBreakdown, List[str], List[str], List[str], List[str], Optional[float]]:
        """
        Calculates composite match score between Problem (and its AI analysis) and candidate Organization.
        Returns: (total_score, score_breakdown, reasons, matched_skills, matched_domains, matched_keywords, distance_km)
        """
        reasons: List[str] = []
        matched_skills: List[str] = []
        matched_domains: List[str] = []
        matched_keywords: List[str] = []

        # -------------------------------------------------------------
        # 1. FACTOR 1: REQUIRED EXPERTISE MATCH (40%)
        # -------------------------------------------------------------
        req_expertise = ai_analysis.get("required_expertise", [])
        org_expertise = organization.get("expertise", [])

        req_norm = cls._normalize_set(req_expertise)
        org_norm = cls._normalize_set(org_expertise)

        if req_norm:
            matched_tokens = req_norm.intersection(org_norm)
            expertise_ratio = len(matched_tokens) / max(1, len(req_norm))
            expertise_score = round(min(cls.WEIGHT_EXPERTISE, expertise_ratio * cls.WEIGHT_EXPERTISE), 1)

            # Find matching human-readable expertise items
            for skill in org_expertise:
                if any(tok in skill.lower() for tok in matched_tokens):
                    if skill not in matched_skills:
                        matched_skills.append(skill)
        else:
            expertise_score = 25.0

        if expertise_score >= 25.0 and matched_skills:
            reasons.append(f"Strong faculty/squad expertise match in {', '.join(matched_skills[:2])}")

        # -------------------------------------------------------------
        # 2. FACTOR 2: RESEARCH & APPLICATION DOMAIN MATCH (20%)
        # -------------------------------------------------------------
        suggested_domains = ai_analysis.get("suggested_research_domains", []) + [problem.get("category", "")]
        org_domains = organization.get("domains", []) + organization.get("expertise", [])

        dom_norm = cls._normalize_set(suggested_domains)
        org_dom_norm = cls._normalize_set(org_domains)

        if dom_norm:
            matched_dom_tokens = dom_norm.intersection(org_dom_norm)
            domain_ratio = len(matched_dom_tokens) / max(1, len(dom_norm))
            domain_score = round(min(cls.WEIGHT_DOMAIN, domain_ratio * cls.WEIGHT_DOMAIN), 1)

            for d in org_domains:
                if any(tok in d.lower() for tok in matched_dom_tokens):
                    if d not in matched_domains:
                        matched_domains.append(d)
        else:
            domain_score = 12.0

        if domain_score >= 12.0 and matched_domains:
            reasons.append(f"Specialized active research in {', '.join(matched_domains[:2])}")

        # -------------------------------------------------------------
        # 3. FACTOR 3: TECHNOLOGY CAPABILITY MATCH (15%)
        # -------------------------------------------------------------
        rnd_brief = ai_analysis.get("rnd_brief", {})
        tech_areas = rnd_brief.get("suggested_technology_areas", [])
        support_capabilities = organization.get("support_available", []) + organization.get("expertise", [])

        tech_norm = cls._normalize_set(tech_areas)
        supp_norm = cls._normalize_set(support_capabilities)

        if tech_norm:
            tech_match_tokens = tech_norm.intersection(supp_norm)
            tech_ratio = len(tech_match_tokens) / max(1, len(tech_norm))
            technology_score = round(min(cls.WEIGHT_TECH, tech_ratio * cls.WEIGHT_TECH), 1)
        else:
            technology_score = 10.0

        if target_type == TargetType.INDUSTRY:
            support_items = organization.get("support_available", [])
            if any(s in support_items for s in ["Funding", "CSR Grants", "Hardware & Sensor Kits"]):
                technology_score = min(cls.WEIGHT_TECH, technology_score + 5.0)
                reasons.append("Direct CSR co-funding and prototyping lab sponsorship available")

        # -------------------------------------------------------------
        # 4. FACTOR 4: GEOGRAPHICAL PROXIMITY (10%)
        # -------------------------------------------------------------
        prob_lat = problem.get("location", {}).get("latitude")
        prob_lon = problem.get("location", {}).get("longitude")
        org_lat = organization.get("latitude", 23.3441)
        org_lon = organization.get("longitude", 85.3096)

        distance_km: Optional[float] = None
        if prob_lat is not None and prob_lon is not None and org_lat is not None and org_lon is not None:
            distance_km = round(cls._calculate_haversine_distance(prob_lat, prob_lon, org_lat, org_lon), 1)

            if distance_km <= 25.0:
                location_score = 10.0
                reasons.append(f"Immediate regional proximity ({distance_km} km away in same district)")
            elif distance_km <= 60.0:
                location_score = 8.0
                reasons.append(f"Nearby district proximity ({distance_km} km away)")
            elif distance_km <= 120.0:
                location_score = 6.0
            else:
                location_score = 4.0
        else:
            location_score = 5.0

        # -------------------------------------------------------------
        # 5. FACTOR 5: KEYWORD SEMANTIC MATCH (10%)
        # -------------------------------------------------------------
        keywords = rnd_brief.get("relevant_keywords", [])
        org_text = f"{organization.get('name', '')} {' '.join(organization.get('expertise', []))} {' '.join(organization.get('domains', []))}"
        org_tokens = cls._tokenize_text(org_text)

        kw_matches = 0
        for kw in keywords:
            kw_toks = cls._normalize_set([kw])
            if kw_toks.intersection(org_tokens):
                kw_matches += 1
                matched_keywords.append(kw)

        if keywords:
            kw_ratio = kw_matches / max(1, len(keywords))
            keyword_score = round(min(cls.WEIGHT_KEYWORD, kw_ratio * cls.WEIGHT_KEYWORD), 1)
        else:
            keyword_score = 6.0

        # -------------------------------------------------------------
        # 6. FACTOR 6: VERIFICATION & CAPACITY (5%)
        # -------------------------------------------------------------
        is_verified = organization.get("is_verified", True)
        availability_score = 5.0 if is_verified else 3.0

        # -------------------------------------------------------------
        # COMPOSITE SCORE
        # -------------------------------------------------------------
        total_score = round(
            min(100.0, max(30.0, expertise_score + domain_score + technology_score + location_score + keyword_score + availability_score)),
            1
        )

        breakdown = ScoreBreakdown(
            expertise_score=expertise_score,
            domain_score=domain_score,
            technology_score=technology_score,
            location_score=location_score,
            keyword_score=keyword_score,
            availability_score=availability_score,
            total_score=total_score
        )

        if not reasons:
            reasons.append(f"Verified {target_type.value.capitalize()} partner aligned with {problem.get('category')} challenges")

        return total_score, breakdown, reasons, matched_skills[:4], matched_domains[:4], matched_keywords[:4], distance_km

    @staticmethod
    def _tokenize_text(text: str) -> set:
        clean = "".join([c.lower() if c.isalnum() else " " for c in text])
        return {w for w in clean.split() if len(w) > 2}


# =============================================================================
# MATCHING SERVICE
# =============================================================================
class MatchingService:
    """
    Service orchestrating smart problem-to-squad and problem-to-CSR matches.
    """

    @staticmethod
    def _doc_to_match_response(doc: Dict[str, Any]) -> MatchResponse:
        doc_copy = doc.copy()
        if "_id" in doc_copy:
            doc_copy["id"] = str(doc_copy["_id"])
            del doc_copy["_id"]

        reasons = doc_copy.get("reasons", [])
        primary_reason = reasons[0] if reasons else "High capability alignment with civic challenge."
        target_id = str(doc_copy.get("target_id", ""))
        target_name = str(doc_copy.get("target_name", ""))
        dist = doc_copy.get("distance_km")

        return MatchResponse(
            id=doc_copy["id"],
            problem_id=str(doc_copy["problem_id"]),
            problem_title=doc_copy.get("problem_title"),
            problem_category=doc_copy.get("problem_category"),
            target_type=TargetType(doc_copy["target_type"]),
            target_id=target_id,
            target_name=target_name,
            target_email=doc_copy.get("target_email"),
            organization_id=target_id,
            organization_name=target_name,
            match_score=float(doc_copy["score"]),
            score_breakdown=ScoreBreakdown(**doc_copy["score_breakdown"]),
            matching_reason=primary_reason,
            reasons=reasons,
            matched_expertise=doc_copy.get("matched_skills", []),
            matched_domains=doc_copy.get("matched_domains", []),
            matched_keywords=doc_copy.get("matched_keywords", []),
            location_distance=dist,
            location_distance_km=dist,
            status=MatchStatus(doc_copy.get("status", MatchStatus.PROPOSED.value)),
            response_note=doc_copy.get("response_note"),
            is_semantic=doc_copy.get("is_semantic", True),
            created_at=doc_copy.get("created_at", datetime.utcnow()),
            updated_at=doc_copy.get("updated_at", datetime.utcnow())
        )

    @classmethod
    async def get_or_calculate_problem_matches(
        cls,
        db: AsyncIOMotorDatabase,
        problem_id: str,
        target_type: TargetType
    ) -> List[MatchResponse]:
        """
        Computes or retrieves matching Universities or Industries for a problem.
        """
        problems_col = db["problems"]
        matches_col = db["matches"]

        try:
            obj_id = ObjectId(problem_id)
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid problem ID format.")

        problem = await problems_col.find_one({"_id": obj_id})
        if not problem:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found.")

        # 1. Fetch AI Analysis for problem (calculates on demand if missing)
        ai_analysis_res = await AIService.get_analysis_by_problem_id(db, problem_id)
        ai_analysis_dict = ai_analysis_res.model_dump()

        # 2. Get candidate organizations from DB or Seeds
        candidates = await cls._fetch_candidate_organizations(db, target_type)

        # 3. Calculate match score for each candidate
        matches_list = []
        now = datetime.utcnow()

        for cand in candidates:
            score, breakdown, reasons, skills, domains, keywords, distance_km = MatchingEngine.compute_match_score(
                problem=problem,
                ai_analysis=ai_analysis_dict,
                organization=cand,
                target_type=target_type
            )

            cand_id = str(cand.get("_id", cand.get("id", str(ObjectId()))))
            cand_name = cand.get("organization_name") or cand.get("company_name") or cand.get("name")

            match_doc = {
                "problem_id": problem_id,
                "problem_title": problem.get("title"),
                "problem_category": problem.get("category"),
                "target_type": target_type.value,
                "target_id": cand_id,
                "target_name": cand_name,
                "target_email": cand.get("email") or cand.get("official_email"),
                "score": score,
                "score_breakdown": breakdown.model_dump(),
                "reasons": reasons,
                "matched_skills": skills,
                "matched_domains": domains,
                "matched_keywords": keywords,
                "distance_km": distance_km,
                "status": MatchStatus.PROPOSED.value,
                "is_semantic": not ai_analysis_res.is_fallback,
                "updated_at": now
            }

            # Upsert into matches collection
            upsert_res = await matches_col.find_one_and_update(
                {"problem_id": problem_id, "target_id": cand_id},
                {"$set": match_doc, "$setOnInsert": {"created_at": now}},
                upsert=True,
                return_document=True
            )
            matches_list.append(cls._doc_to_match_response(upsert_res))

        # Sort by match score descending
        matches_list.sort(key=lambda m: m.match_score, reverse=True)
        return matches_list

    @classmethod
    async def get_recommendations_for_organization(
        cls,
        db: AsyncIOMotorDatabase,
        target_type: TargetType,
        current_user: Optional[UserProfileResponse] = None,
        org_id: Optional[str] = None
    ) -> List[ProblemRecommendationResponse]:
        """
        Returns ranked problem challenge recommendations personalized for a University or Industry.
        Works with authenticated user session or organization identifier.
        """
        problems_col = db["problems"]
        matches_col = db["matches"]
        users_col = db["users"]

        # Determine target organization profile
        org_profile: Dict[str, Any] = {}
        if current_user and current_user.role in [UserRole.UNIVERSITY, UserRole.INDUSTRY]:
            org_profile = current_user.model_dump()
            target_type = TargetType.UNIVERSITY if current_user.role == UserRole.UNIVERSITY else TargetType.INDUSTRY
        elif org_id:
            try:
                db_user = await users_col.find_one({"_id": ObjectId(org_id)})
                if db_user:
                    org_profile = db_user
                    org_profile["id"] = str(db_user["_id"])
            except Exception:
                pass

        if not org_profile:
            # Fallback to top verified seed entity of requested target_type
            candidates = await cls._fetch_candidate_organizations(db, target_type)
            if candidates:
                org_profile = candidates[0]
                org_profile["id"] = str(org_profile.get("_id", org_profile.get("id", str(ObjectId()))))

        user_id = str(org_profile.get("id", org_profile.get("_id", "seed_org_1")))

        # Fetch recent open problems
        cursor = problems_col.find({"status": {"$ne": "CLOSED"}}).sort("created_at", -1).limit(20)
        recommendations = []

        async for prob in cursor:
            prob_id = str(prob["_id"])
            try:
                ai_analysis_res = await AIService.get_analysis_by_problem_id(db, prob_id)
                ai_analysis_dict = ai_analysis_res.model_dump()
            except Exception:
                continue

            score, breakdown, reasons, skills, domains, keywords, distance_km = MatchingEngine.compute_match_score(
                problem=prob,
                ai_analysis=ai_analysis_dict,
                organization=org_profile,
                target_type=target_type
            )

            # Check existing match record status if any
            existing = await matches_col.find_one({"problem_id": prob_id, "target_id": user_id})
            match_status = MatchStatus(existing.get("status")) if existing else MatchStatus.PROPOSED
            match_id = str(existing["_id"]) if existing else f"match_{prob_id}_{user_id}"

            recommendations.append(
                ProblemRecommendationResponse(
                    problem_id=prob_id,
                    problem_title=prob.get("title", ""),
                    category=prob.get("category", ""),
                    urgency=prob.get("urgency", "MEDIUM"),
                    district=prob.get("location", {}).get("district", "Jharkhand"),
                    city=prob.get("location", {}).get("city", "Ranchi"),
                    affected_people=prob.get("affected_people"),
                    match_score=score,
                    score_breakdown=breakdown,
                    matched_expertise=skills,
                    matched_domains=domains,
                    distance_km=distance_km,
                    matching_reason=reasons[0] if reasons else "High capability alignment with civic challenge.",
                    match_status=match_status,
                    match_id=match_id
                )
            )

        # Sort recommendations by highest match score
        recommendations.sort(key=lambda r: r.match_score, reverse=True)
        return recommendations

    @classmethod
    async def express_interest(
        cls,
        db: AsyncIOMotorDatabase,
        match_id: str,
        current_user: UserProfileResponse,
        payload: ExpressInterestRequest
    ) -> MatchResponse:
        """
        Accepts a matched problem challenge and expresses squad/CSR commitment.
        """
        matches_col = db["matches"]
        problems_col = db["problems"]
        now = datetime.utcnow()

        try:
            obj_id = ObjectId(match_id)
            query = {"_id": obj_id}
        except Exception:
            # Fallback if match_id was a virtual string
            query = {"target_id": current_user.id}

        match = await matches_col.find_one(query)
        if not match:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match record not found.")

        # Update match status to INTERESTED / ACCEPTED
        updated = await matches_col.find_one_and_update(
            {"_id": match["_id"]},
            {
                "$set": {
                    "status": MatchStatus.INTERESTED.value,
                    "response_note": payload.note,
                    "squad_lead": payload.squad_lead or current_user.name,
                    "estimated_timeline_weeks": payload.estimated_timeline_weeks,
                    "updated_at": now
                }
            },
            return_document=True
        )

        # Progress problem status to MATCHING / COLLABORATION
        try:
            prob_obj_id = ObjectId(match["problem_id"])
            await problems_col.update_one(
                {"_id": prob_obj_id},
                {"$set": {"status": "COLLABORATION", "updated_at": now}}
            )
        except Exception:
            pass

        logger.info(f"User {current_user.email} expressed interest in Match {match_id} (Problem: {match.get('problem_id')})")
        return cls._doc_to_match_response(updated)

    @classmethod
    async def reject_match(
        cls,
        db: AsyncIOMotorDatabase,
        match_id: str,
        current_user: UserProfileResponse,
        payload: RejectMatchRequest
    ) -> MatchResponse:
        """
        Declines a match recommendation.
        """
        matches_col = db["matches"]
        now = datetime.utcnow()

        try:
            obj_id = ObjectId(match_id)
            query = {"_id": obj_id}
        except Exception:
            query = {"target_id": current_user.id}

        match = await matches_col.find_one(query)
        if not match:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match record not found.")

        updated = await matches_col.find_one_and_update(
            {"_id": match["_id"]},
            {
                "$set": {
                    "status": MatchStatus.REJECTED.value,
                    "response_note": payload.reason,
                    "updated_at": now
                }
            },
            return_document=True
        )

        logger.info(f"User {current_user.email} rejected Match {match_id}")
        return cls._doc_to_match_response(updated)

    @classmethod
    async def _fetch_candidate_organizations(
        cls,
        db: AsyncIOMotorDatabase,
        target_type: TargetType
    ) -> List[Dict[str, Any]]:
        """
        Fetches registered organizations from MongoDB, augmenting with verified seed institutions if needed.
        """
        users_col = db["users"]
        role_filter = UserRole.UNIVERSITY.value if target_type == TargetType.UNIVERSITY else UserRole.INDUSTRY.value

        cursor = users_col.find({"role": role_filter})
        db_orgs = []
        async for doc in cursor:
            db_orgs.append(doc)

        # If few records in database, merge with verified seed organizations
        if len(db_orgs) < 3:
            seeds = SEED_UNIVERSITIES if target_type == TargetType.UNIVERSITY else SEED_INDUSTRIES
            existing_emails = {o.get("email") or o.get("official_email") for o in db_orgs}
            for seed in seeds:
                if seed["email"] not in existing_emails:
                    db_orgs.append(seed)

        return db_orgs

    @classmethod
    async def seed_verified_organizations_if_needed(cls, db: AsyncIOMotorDatabase) -> None:
        """
        Seeds baseline verified universities and industry CSR partners in MongoDB if absent.
        Populates both 'users', 'universities', and 'industries' collections.
        """
        users_col = db["users"]
        univ_col = db["universities"]
        ind_col = db["industries"]
        now = datetime.utcnow()

        for uni in SEED_UNIVERSITIES:
            # 1. Users collection
            existing_user = await users_col.find_one({"email": uni["email"]})
            if not existing_user:
                doc = uni.copy()
                doc["role"] = UserRole.UNIVERSITY.value
                doc["password_hash"] = hash_password("UnivSecure@2026")
                doc["created_at"] = now
                doc["updated_at"] = now
                await users_col.insert_one(doc)

            # 2. Dedicated universities collection
            existing_uni = await univ_col.find_one({"official_email": uni["email"]})
            if not existing_uni:
                u_doc = {
                    "organization_name": uni["organization_name"],
                    "official_email": uni["email"],
                    "contact_person": uni.get("contact_person"),
                    "location": uni["location"],
                    "departments": [uni["department"]],
                    "department": uni["department"],
                    "expertise": uni["expertise"],
                    "domains": uni["domains"],
                    "research_areas": uni["domains"],
                    "technologies": ["IoT Telemetry", "AI Computer Vision", "Drone Sensors", "Edge Microcontrollers"],
                    "latitude": uni["latitude"],
                    "longitude": uni["longitude"],
                    "location_point": {
                        "type": "Point",
                        "coordinates": [uni["longitude"], uni["latitude"]]
                    },
                    "verification_status": "Approved",
                    "created_at": now
                }
                await univ_col.insert_one(u_doc)

        for ind in SEED_INDUSTRIES:
            # 1. Users collection
            existing_user = await users_col.find_one({"email": ind["email"]})
            if not existing_user:
                doc = ind.copy()
                doc["role"] = UserRole.INDUSTRY.value
                doc["password_hash"] = hash_password("IndustrySecure@2026")
                doc["created_at"] = now
                doc["updated_at"] = now
                await users_col.insert_one(doc)

            # 2. Dedicated industries collection
            existing_ind = await ind_col.find_one({"official_email": ind["email"]})
            if not existing_ind:
                i_doc = {
                    "company_name": ind["company_name"],
                    "official_email": ind["email"],
                    "industry_type": ind["industry_type"],
                    "expertise": ind["expertise"],
                    "technologies": ["Clean Tech", "Telemetry Nodes", "Solar Kits", "Heavy Fab"],
                    "support_available": ind["support_available"],
                    "research_interests": ["Civic Innovation", "Rural Water Supply", "Clean Energy", "Waste Recycling"],
                    "location": ind["location"],
                    "latitude": ind["latitude"],
                    "longitude": ind["longitude"],
                    "location_point": {
                        "type": "Point",
                        "coordinates": [ind["longitude"], ind["latitude"]]
                    },
                    "verification_status": "Approved",
                    "created_at": now
                }
                await ind_col.insert_one(i_doc)

        logger.info("Verified Jharkhand Universities and CSR Industry partners seeded successfully across collections.")

