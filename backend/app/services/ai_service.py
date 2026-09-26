import os
import json
import logging
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Optional, Dict, Any, List, Tuple
from bson import ObjectId
import httpx
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException, status

from app.config.settings import get_settings
from app.models.ai_analysis import AnalysisStatus, RndBrief, AIAnalysisDocument
from app.models.problem import ProblemStatus, AIAnalysisStatus
from app.schemas.ai_analysis import (
    AIAnalysisResponse,
    RndBriefResponse,
    DuplicateDetectionResponse,
)

logger = logging.getLogger("civic2campus.ai_service")


# =============================================================================
# 1. AI PROVIDER ABSTRACTION INTERFACE
# =============================================================================
class BaseAIProvider(ABC):
    """
    Abstract AI Provider Interface allowing seamless swapping between
    Google Gemini, Anthropic, OpenAI, or local on-prem LLMs.
    """

    @abstractmethod
    async def generate_problem_analysis(
        self,
        problem: Dict[str, Any],
        similar_problems: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Generates classification, priority reasoning, and 10-point R&D brief.
        """
        pass


# =============================================================================
# 2. GOOGLE GEMINI AI PROVIDER
# =============================================================================
class GeminiAIProvider(BaseAIProvider):
    """
    Direct asynchronous Google Gemini REST integration.
    """

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.endpoint = (
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
        )

    async def generate_problem_analysis(
        self,
        problem: Dict[str, Any],
        similar_problems: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        prompt = f"""
You are the Lead Civic AI Scientist for the State of Jharkhand's Civic2Campus Innovation Mission.
Analyze the following citizen-reported community problem and generate a comprehensive scientific classification and 10-point R&D Brief for engineering universities and corporate CSR sponsors.

PROBLEM DETAILS:
- Title: {problem.get('title')}
- Description: {problem.get('description')}
- Category: {problem.get('category')}
- Urgency: {problem.get('urgency')}
- Affected People: {problem.get('affected_people', 'Not specified')}
- Affected Area: {problem.get('affected_area', 'Not specified')}
- Frequency: {problem.get('frequency', 'Daily')}
- Location: {problem.get('location', {}).get('address')}, {problem.get('location', {}).get('city')}, {problem.get('location', {}).get('district')}, Jharkhand

You MUST respond strictly with valid JSON only. Do not include markdown code block formatting.
JSON Schema:
{{
  "category": "{problem.get('category')}",
  "subcategory": "string",
  "priority": "HIGH or CRITICAL or MEDIUM or LOW",
  "priority_reason": "string explaining urgency and community impact",
  "confidence": 0.95,
  "problem_type": "INFRASTRUCTURE_DEFICIT or ENVIRONMENTAL_HAZARD or PUBLIC_HEALTH_RISK or RESOURCE_SCARCITY or EDUCATION_DEFICIT",
  "affected_domain": "string",
  "required_expertise": ["AI / ML", "IoT & Embedded", "Civil Engineering"],
  "suggested_research_domains": ["string", "string"],
  "suggested_solution_areas": ["string", "string"],
  "rnd_brief": {{
    "problem_statement": "1. Concise academic definition of the core challenge",
    "current_situation": "2. Detailed on-ground symptoms in Jharkhand",
    "key_challenges": ["challenge 1", "challenge 2", "challenge 3"],
    "required_expertise": ["skill 1", "skill 2", "skill 3"],
    "suggested_research_area": ["area 1", "area 2"],
    "suggested_technology_areas": ["tech 1", "tech 2"],
    "potential_solution_direction": ["prototype approach 1", "approach 2"],
    "stakeholders": ["Citizen Community", "Panchayat", "University Squad", "Industry CSR Sponsor"],
    "expected_impact": "string describing quantifiable outcome",
    "relevant_keywords": ["keyword1", "keyword2", "keyword3"]
  }}
}}
"""
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.2,
                "responseMimeType": "application/json"
            }
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(self.endpoint, json=payload)
            response.raise_for_status()
            data = response.json()

            raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
            # Clean possible markdown wrapping
            cleaned_text = raw_text.strip()
            if cleaned_text.startswith("```json"):
                cleaned_text = cleaned_text[7:]
            if cleaned_text.endswith("```"):
                cleaned_text = cleaned_text[:-3]

            parsed = json.loads(cleaned_text.strip())
            parsed["provider"] = "gemini-2.0-flash"
            parsed["is_fallback"] = False
            return parsed


# =============================================================================
# 3. DETERMINISTIC EXPERT FALLBACK PROVIDER
# =============================================================================
class DeterministicFallbackProvider(BaseAIProvider):
    """
    Expert heuristic analysis engine tailored for Jharkhand civic challenges.
    Used when AI_API_KEY is not configured or upstream LLM is unreachable.
    """

    async def generate_problem_analysis(
        self,
        problem: Dict[str, Any],
        similar_problems: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        title = problem.get("title", "")
        desc = problem.get("description", "")
        category = problem.get("category", "Water & Sanitation")
        urgency = problem.get("urgency", "HIGH")
        district = problem.get("location", {}).get("district", "Jharkhand")
        city = problem.get("location", {}).get("city", district)
        affected = problem.get("affected_people") or "500+ local residents"

        # Domain specific R&D templates
        if "water" in category.lower() or "sanitation" in category.lower():
            subcategory = "Groundwater Contamination & Filtration"
            problem_type = "ENVIRONMENTAL_HAZARD"
            expertise = ["Environmental Engineering", "IoT & Sensor Telemetry", "Chemical Bio-Filtration", "Clean Water Tech"]
            research_domains = ["Low-cost Fluoride/Arsenic Adsorption Media", "Solar Powered Smart Water ATMs", "Real-time pH/TDS Telemetry Nodes"]
            solution_areas = ["Multi-stage Media Adsorption Filter", "Battery-backed Solar Flow Node", "Community Panchayat Water Dispenser"]
            statement = f"Remediating hazardous water quality and ensuring safe drinking water access across {city}, {district} using low-cost decentralized filtration."
            current = f"Groundwater sources in {city} suffer from seasonal or chronic contamination, directly impacting {affected}."
            tech_areas = ["ESP32/LoRaWAN Water Sensors", "Activated Alumina/Graphene Adsorbents", "Cloud Geospatial Dashboard"]
            impact = f"Safe, WHO-compliant drinking water for {affected} and zero incidence of water-borne fluorosis/gastroenteritis in {district}."
            keywords = ["Arsenic", "Fluoride", "IoT Telemetry", "Solar Water ATM", "Water Quality Index", "Jharkhand Jal Jeevan"]

        elif "waste" in category.lower():
            subcategory = "Municipal Solid Waste & Circular Recycling"
            problem_type = "ENVIRONMENTAL_HAZARD"
            expertise = ["Environmental Science", "Mechanical Automation", "AI Computer Vision", "Biogas Generation"]
            research_domains = ["Automated Waste Segregation using AI Vision", "Anaerobic Composting Digestion", "Plastic Pyrolysis"]
            solution_areas = ["Smart Solar Waste Compactor Bins", "Micro-MRF Facility Automation", "Panchayat Bio-gas Digester"]
            statement = f"Eliminating unregulated open dumping and establishing closed-loop organic waste conversion in {city}."
            current = f"Unsegregated municipal solid waste accumulation causing localized sanitation hazards for {affected}."
            tech_areas = ["Edge AI Computer Vision Sorting", "IoT Fill-level Ultrasonic Sensors", "Smart Logistics Dispatch"]
            impact = f"80% reduction in landfill dumping and creation of local bio-fertilizer revenue for {district}."
            keywords = ["Solid Waste", "AI Vision", "Ultrasonic Node", "Composting", "Circular Economy", "Swachh Bharat"]

        elif "health" in category.lower():
            subcategory = "Rural Telemedicine & Point-of-Care Diagnostics"
            problem_type = "PUBLIC_HEALTH_RISK"
            expertise = ["Biomedical Engineering", "Telemedicine Software", "AI Health Screening", "Clinical Epidemiology"]
            research_domains = ["Low-bandwidth Mobile Diagnostics", "AI Screening for Maternal & Child Health", "Cold Chain Logistics"]
            solution_areas = ["Portable Diagnostic Backpack Kits", "Offline-first Tele-consultation PWA", "Solar Vaccine Coolers"]
            statement = f"Deploying low-cost remote diagnostic and tele-consultation kiosks to bridge primary healthcare deficits in {district}."
            current = f"Primary health sub-centers in {city} face specialist doctor shortages affecting {affected}."
            tech_areas = ["Point-of-care ECG/SpO2/Vitals Kit", "Edge AI Image Triage", "WebRTC Video Stream"]
            impact = f"Instant primary diagnostic access within 15 minutes for {affected} across rural {district}."
            keywords = ["Telemedicine", "Rural Health", "AI Triage", "Biomedical Sensor", "Ayushman Bharat", "Maternal Care"]

        elif "agriculture" in category.lower():
            subcategory = "Smart Precision Irrigation & Pest Management"
            problem_type = "RESOURCE_SCARCITY"
            expertise = ["Agronomy", "IoT Soil Telemetry", "Drone Robotics", "Solar Power Systems"]
            research_domains = ["Soil Moisture Micro-irrigation Automation", "AI Crop Disease Classification", "Solar Pump Scheduling"]
            solution_areas = ["Low-power LoRa Soil Moisture Probes", "Mobile Crop Health AI Scanner", "Panchayat Shared Solar Drip Kit"]
            statement = f"Enhancing crop yield and optimizing groundwater utilization for smallholder farmers in {city}, {district}."
            current = f"Irregular rainfall and pest attacks lowering farm income for {affected}."
            tech_areas = ["Capacitive Soil Probes", "LoRaWAN Farm Gateway", "TensorFlow Lite Crop Classifier"]
            impact = f"40% reduction in irrigation water usage and 25% increase in seasonal crop output for {district} farmers."
            keywords = ["Smart Irrigation", "LoRaWAN Soil Probe", "AI Crop Doctor", "Precision Agriculture", "Solar Pump"]

        else:
            subcategory = "Civic Infrastructure Modernization"
            problem_type = "INFRASTRUCTURE_DEFICIT"
            expertise = ["Civil & Structural Engineering", "IoT Sensor Networks", "Public Systems Optimization", "Renewable Energy"]
            research_domains = ["Modular Sustainable Construction", "Solar Micro-grid Infrastructure", "Predictive Asset Monitoring"]
            solution_areas = ["Low-cost Pre-cast Modular Systems", "Vibration/Load Sensor Node", "Public Reporting Telemetry"]
            statement = f"Modernizing critical public infrastructure in {city}, {district} to ensure safety and resilience for {affected}."
            current = f"Degraded infrastructure causing safety hazards and daily bottlenecks for {affected}."
            tech_areas = ["Structural Health IoT Nodes", "Geo-tagged Asset Mapping", "Solar Powered Utility Systems"]
            impact = f"Zero structural failures and continuous civic utility availability for {affected}."
            keywords = ["Infrastructure", "Smart Cities", "IoT Telemetry", "Solar Grid", "Public Safety", "Jharkhand 2026"]

        priority_reason = (
            f"Evaluated as {urgency} priority due to direct impact on {affected} in {city}, {district}. "
            f"Requires multi-disciplinary engineering intervention across {', '.join(expertise[:2])}."
        )

        rnd_brief_obj = {
            "problem_statement": statement,
            "current_situation": current,
            "key_challenges": [
                f"Geographical accessibility and rugged terrain in {district}",
                f"Intermittent power grid requiring solar / battery backup",
                f"Affordable unit economics for Panchayat community deployment"
            ],
            "required_expertise": expertise,
            "suggested_research_area": research_domains,
            "suggested_technology_areas": tech_areas,
            "potential_solution_direction": solution_areas,
            "stakeholders": ["Local Panchayat & Ward Citizens", "District Administration", "BIT Mesra / Engineering Squads", "Corporate CSR Sponsors"],
            "expected_impact": impact,
            "relevant_keywords": keywords
        }

        return {
            "category": category,
            "subcategory": subcategory,
            "priority": urgency,
            "priority_reason": priority_reason,
            "confidence": 0.92,
            "problem_type": problem_type,
            "affected_domain": category,
            "required_expertise": expertise,
            "suggested_research_domains": research_domains,
            "suggested_solution_areas": solution_areas,
            "rnd_brief": rnd_brief_obj,
            "provider": "heuristic-expert-engine-v1",
            "is_fallback": True
        }


# =============================================================================
# 4. DUPLICATE & SIMILAR PROBLEM DETECTOR
# =============================================================================
class DuplicateDetector:
    """
    Detects duplicate and semantically similar problem reports using keyword overlap,
    district/city clustering, and category matching.
    """

    @staticmethod
    def _tokenize(text: str) -> set:
        clean = "".join([c.lower() if c.isalnum() else " " for c in text])
        stopwords = {"the", "a", "an", "in", "on", "at", "and", "or", "is", "of", "to", "for", "with", "by", "jharkhand", "area"}
        return {w for w in clean.split() if len(w) > 2 and w not in stopwords}

    @classmethod
    async def find_similar_problems(
        cls,
        db: AsyncIOMotorDatabase,
        target_problem: Dict[str, Any],
        similarity_threshold: float = 0.3
    ) -> Tuple[List[str], float, List[str]]:
        """
        Scans existing problems in MongoDB to detect potential duplicates.
        Returns: (similar_problem_ids, highest_duplicate_probability, reasons)
        """
        problems_col = db["problems"]
        target_id = str(target_problem.get("_id", target_problem.get("id", "")))
        target_cat = target_problem.get("category", "")
        target_district = target_problem.get("location", {}).get("district", "")
        target_text = f"{target_problem.get('title', '')} {target_problem.get('description', '')}"
        target_tokens = cls._tokenize(target_text)

        if not target_tokens:
            return [], 0.0, []

        query: Dict[str, Any] = {
            "category": target_cat
        }
        if target_id:
            try:
                query["_id"] = {"$ne": ObjectId(target_id)}
            except Exception:
                pass

        similar_ids: List[str] = []
        highest_score = 0.0
        reasons: List[str] = []

        cursor = problems_col.find(query).limit(50)
        async for other in cursor:
            other_id = str(other["_id"])
            other_text = f"{other.get('title', '')} {other.get('description', '')}"
            other_tokens = cls._tokenize(other_text)

            intersection = target_tokens.intersection(other_tokens)
            union = target_tokens.union(other_tokens)

            if not union:
                continue

            jaccard = len(intersection) / len(union)

            # Boost if in same district
            same_district = other.get("location", {}).get("district", "").lower() == target_district.lower()
            if same_district:
                jaccard = min(1.0, jaccard + 0.15)

            if jaccard >= similarity_threshold:
                similar_ids.append(other_id)
                if jaccard > highest_score:
                    highest_score = jaccard
                    matched_words = list(intersection)[:4]
                    reason_msg = f"Overlaps with Problem '{other.get('title')}' in {target_district} (Keywords: {', '.join(matched_words)})"
                    reasons.append(reason_msg)

        return similar_ids[:5], round(highest_score, 2), reasons[:3]


# =============================================================================
# 5. CORE AI SERVICE
# =============================================================================
class AIService:
    """
    Central AI orchestration service.
    Manages analysis generation, R&D brief formatting, and duplicate linking.
    """

    @staticmethod
    def _doc_to_response(doc: Dict[str, Any]) -> AIAnalysisResponse:
        doc_copy = doc.copy()
        if "_id" in doc_copy:
            doc_copy["id"] = str(doc_copy["_id"])
            del doc_copy["_id"]
        return AIAnalysisResponse(**doc_copy)

    @classmethod
    async def analyze_problem(
        cls,
        db: AsyncIOMotorDatabase,
        problem_id: str
    ) -> AIAnalysisResponse:
        """
        Executes complete AI analysis for a problem:
        1. Fetches Problem from MongoDB
        2. Detects similar/duplicate issues
        3. Calls AI provider (Gemini or expert fallback)
        4. Saves result to 'ai_analyses' collection
        5. Updates Problem status to AI_ANALYSIS
        """
        settings = get_settings()
        problems_col = db["problems"]
        ai_col = db["ai_analyses"]

        try:
            obj_id = ObjectId(problem_id)
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid problem ID format.")

        problem = await problems_col.find_one({"_id": obj_id})
        if not problem:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found.")

        # 1. Duplicate & Similarity Detection
        similar_ids, dup_prob, sim_reasons = await DuplicateDetector.find_similar_problems(db, problem)

        # 2. Select AI Provider
        provider: BaseAIProvider
        if settings.AI_API_KEY and len(settings.AI_API_KEY.strip()) > 5:
            provider = GeminiAIProvider(settings.AI_API_KEY.strip())
        else:
            logger.info("AI_API_KEY not configured. Utilizing deterministic expert analysis engine.")
            provider = DeterministicFallbackProvider()

        # 3. Generate AI Analysis
        try:
            analysis_data = await provider.generate_problem_analysis(problem, [])
        except Exception as exc:
            logger.warning(f"Upstream AI Provider failed ({exc}). Falling back to expert engine.")
            fallback = DeterministicFallbackProvider()
            analysis_data = await fallback.generate_problem_analysis(problem, [])
            analysis_data["error_message"] = str(exc)

        # 4. Integrate duplicate results
        analysis_data["problem_id"] = str(problem["_id"])
        analysis_data["similar_problem_ids"] = similar_ids
        analysis_data["duplicate_probability"] = dup_prob
        analysis_data["similarity_reasons"] = sim_reasons
        analysis_data["status"] = AnalysisStatus.COMPLETED.value
        now = datetime.utcnow()
        analysis_data["created_at"] = now
        analysis_data["updated_at"] = now

        # 5. Upsert into ai_analyses collection
        upsert_res = await ai_col.find_one_and_update(
            {"problem_id": str(problem["_id"])},
            {"$set": analysis_data},
            upsert=True,
            return_document=True
        )

        # 6. Update Problem status
        await problems_col.update_one(
            {"_id": obj_id},
            {
                "$set": {
                    "ai_analysis_status": AIAnalysisStatus.COMPLETED.value,
                    "status": ProblemStatus.AI_ANALYSIS.value,
                    "updated_at": now
                }
            }
        )

        logger.info(f"AI Analysis completed for Problem {problem_id} (Provider: {analysis_data.get('provider')})")
        return cls._doc_to_response(upsert_res)

    @classmethod
    async def get_analysis_by_problem_id(
        cls,
        db: AsyncIOMotorDatabase,
        problem_id: str
    ) -> AIAnalysisResponse:
        """
        Retrieves existing AI analysis for a given problem ID.
        If analysis does not exist yet, triggers it on the fly.
        """
        ai_col = db["ai_analyses"]
        doc = await ai_col.find_one({"problem_id": problem_id})

        if doc:
            return cls._doc_to_response(doc)

        # If not analyzed yet, run analysis
        return await cls.analyze_problem(db, problem_id)

    @classmethod
    async def get_rnd_brief_by_problem_id(
        cls,
        db: AsyncIOMotorDatabase,
        problem_id: str
    ) -> RndBriefResponse:
        """
        Extracts clean 10-point R&D Brief tailored for student squads and CSR sponsors.
        """
        problems_col = db["problems"]
        try:
            obj_id = ObjectId(problem_id)
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid problem ID format.")

        problem = await problems_col.find_one({"_id": obj_id})
        if not problem:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found.")

        analysis = await cls.get_analysis_by_problem_id(db, problem_id)

        return RndBriefResponse(
            problem_id=problem_id,
            problem_title=problem.get("title", "Civic Problem"),
            category=analysis.category,
            priority=analysis.priority,
            rnd_brief=analysis.rnd_brief,
            generated_by=analysis.provider,
            is_fallback=analysis.is_fallback,
            created_at=analysis.created_at
        )

    @classmethod
    async def detect_duplicates(
        cls,
        db: AsyncIOMotorDatabase,
        problem_id: str
    ) -> DuplicateDetectionResponse:
        """
        Dedicated endpoint to inspect duplicates and similar cluster problems.
        """
        problems_col = db["problems"]
        try:
            obj_id = ObjectId(problem_id)
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid problem ID format.")

        problem = await problems_col.find_one({"_id": obj_id})
        if not problem:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found.")

        similar_ids, dup_prob, reasons = await DuplicateDetector.find_similar_problems(db, problem)

        # Fetch basic details of similar problems
        similar_items = []
        if similar_ids:
            obj_ids = [ObjectId(sid) for sid in similar_ids]
            cursor = problems_col.find({"_id": {"$in": obj_ids}})
            async for doc in cursor:
                similar_items.append({
                    "id": str(doc["_id"]),
                    "title": doc.get("title"),
                    "category": doc.get("category"),
                    "status": doc.get("status"),
                    "district": doc.get("location", {}).get("district")
                })

        return DuplicateDetectionResponse(
            problem_id=problem_id,
            duplicate_probability=dup_prob,
            is_likely_duplicate=dup_prob >= 0.70,
            similar_problems=similar_items,
            reasons=reasons
        )

    @classmethod
    async def run_background_analysis(
        cls,
        db: AsyncIOMotorDatabase,
        problem_id: str
    ) -> None:
        """
        Non-blocking background runner triggered right after citizen problem submission.
        """
        try:
            logger.info(f"Triggering asynchronous AI background analysis for Problem {problem_id}...")
            await cls.analyze_problem(db, problem_id)
        except Exception as exc:
            logger.error(f"Background AI analysis failed for {problem_id}: {exc}", exc_info=True)
