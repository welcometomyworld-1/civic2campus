import logging
from typing import Optional, List, Dict, Any
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.schemas.search import SearchResultItem, GlobalSearchResponse

logger = logging.getLogger("civic2campus.search_service")


class SearchService:
    """
    Unified multi-collection search engine querying Problems, Universities,
    Industries, and Solutions with fuzzy regex matching, category filtering,
    and relevance scoring.
    """

    @classmethod
    async def global_search(
        cls,
        db: AsyncIOMotorDatabase,
        query: str,
        category: Optional[str] = None,
        location: Optional[str] = None,
        status: Optional[str] = None,
        target_type: Optional[str] = None,  # 'problem', 'university', 'industry', 'solution'
        page: int = 1,
        limit: int = 20
    ) -> GlobalSearchResponse:
        """
        Executes unified search across civic domains.
        """
        results: List[SearchResultItem] = []
        clean_q = query.strip() if query else ""
        regex_q = {"$regex": clean_q, "$options": "i"} if clean_q else None

        # 1. Search Problems
        if not target_type or target_type.lower() in ["problem", "problems"]:
            problems_col = db["problems"]
            p_filter: Dict[str, Any] = {}
            if regex_q:
                p_filter["$or"] = [
                    {"title": regex_q},
                    {"description": regex_q},
                    {"category": regex_q},
                    {"tags": regex_q},
                    {"location.city": regex_q},
                    {"location.district": regex_q},
                ]
            if category:
                p_filter["category"] = category
            if status:
                p_filter["status"] = status.upper()
            if location:
                p_filter["$or"] = [
                    {"location.city": {"$regex": location, "$options": "i"}},
                    {"location.district": {"$regex": location, "$options": "i"}},
                ]

            cursor = problems_col.find(p_filter).limit(30)
            async for p in cursor:
                loc_str = f"{p.get('location', {}).get('city', '')}, {p.get('location', {}).get('district', '')}".strip(", ")
                snippet = (p.get("description", "")[:150] + "...") if len(p.get("description", "")) > 150 else p.get("description", "")
                
                # Simple relevance boost
                score = 1.0
                if clean_q and clean_q.lower() in p.get("title", "").lower():
                    score += 0.5

                results.append(
                    SearchResultItem(
                        id=str(p["_id"]),
                        title=p.get("title", "Civic Problem"),
                        type="problem",
                        category=p.get("category"),
                        location=loc_str or "Jharkhand",
                        status=p.get("status"),
                        snippet=snippet,
                        relevance_score=score,
                        extra={
                            "urgency": p.get("urgency"),
                            "affected_people": p.get("affected_people"),
                            "ai_status": p.get("ai_analysis_status")
                        }
                    )
                )

        # 2. Search Universities
        if not target_type or target_type.lower() in ["university", "universities"]:
            univ_col = db["universities"]
            u_filter: Dict[str, Any] = {}
            if regex_q:
                u_filter["$or"] = [
                    {"organization_name": regex_q},
                    {"departments": regex_q},
                    {"expertise": regex_q},
                    {"location": regex_q}
                ]
            if location:
                u_filter["location"] = {"$regex": location, "$options": "i"}

            cursor = univ_col.find(u_filter).limit(20)
            async for u in cursor:
                exp_list = u.get("expertise", [])
                snippet = f"University Squad with expertise in {', '.join(exp_list[:4])}"
                results.append(
                    SearchResultItem(
                        id=str(u["_id"]),
                        title=u.get("organization_name", "University Squad"),
                        type="university",
                        category="Academic R&D",
                        location=u.get("location", "Jharkhand"),
                        status=u.get("verification_status", "Approved"),
                        snippet=snippet,
                        relevance_score=1.1 if clean_q and clean_q.lower() in u.get("organization_name", "").lower() else 0.9,
                        extra={
                            "departments": u.get("departments", []),
                            "expertise": exp_list
                        }
                    )
                )

        # 3. Search Industries
        if not target_type or target_type.lower() in ["industry", "industries"]:
            ind_col = db["industries"]
            i_filter: Dict[str, Any] = {}
            if regex_q:
                i_filter["$or"] = [
                    {"company_name": regex_q},
                    {"industry_type": regex_q},
                    {"expertise": regex_q},
                    {"location": regex_q}
                ]
            if category:
                i_filter["industry_type"] = {"$regex": category, "$options": "i"}
            if location:
                i_filter["location"] = {"$regex": location, "$options": "i"}

            cursor = ind_col.find(i_filter).limit(20)
            async for ind in cursor:
                snippet = f"Industry CSR Partner: {ind.get('industry_type', 'Corporate')} - Supports: {', '.join(ind.get('support_available', [])[:3])}"
                results.append(
                    SearchResultItem(
                        id=str(ind["_id"]),
                        title=ind.get("company_name", "Industry Partner"),
                        type="industry",
                        category=ind.get("industry_type", "Industry"),
                        location=ind.get("location", "Jharkhand"),
                        status=ind.get("verification_status", "Approved"),
                        snippet=snippet,
                        relevance_score=1.1 if clean_q and clean_q.lower() in ind.get("company_name", "").lower() else 0.9,
                        extra={
                            "industry_type": ind.get("industry_type"),
                            "support_available": ind.get("support_available", [])
                        }
                    )
                )

        # 4. Search Solutions
        if not target_type or target_type.lower() in ["solution", "solutions"]:
            sol_col = db["solutions"]
            s_filter: Dict[str, Any] = {}
            if regex_q:
                s_filter["$or"] = [
                    {"title": regex_q},
                    {"description": regex_q},
                    {"solution_type": regex_q},
                    {"technology": regex_q},
                    {"deployment_location": regex_q}
                ]
            if status:
                s_filter["status"] = status.upper()
            if location:
                s_filter["deployment_location"] = {"$regex": location, "$options": "i"}

            cursor = sol_col.find(s_filter).limit(20)
            async for sol in cursor:
                snippet = (sol.get("description", "")[:140] + "...") if len(sol.get("description", "")) > 140 else sol.get("description", "")
                results.append(
                    SearchResultItem(
                        id=str(sol["_id"]),
                        title=sol.get("title", "Deployed Solution"),
                        type="solution",
                        category=sol.get("solution_type", "Technology"),
                        location=sol.get("deployment_location", "Jharkhand"),
                        status=sol.get("status", "DEPLOYED"),
                        snippet=snippet,
                        relevance_score=1.2 if clean_q and clean_q.lower() in sol.get("title", "").lower() else 1.0,
                        extra={
                            "technology": sol.get("technology", []),
                            "deployment_date": sol.get("deployment_date")
                        }
                    )
                )

        # Sort by relevance score
        results.sort(key=lambda x: x.relevance_score, reverse=True)

        total_count = len(results)
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        paginated_items = results[start_idx:end_idx]

        total_pages = (total_count + limit - 1) // limit if limit > 0 else 1

        return GlobalSearchResponse(
            query=clean_q,
            total=total_count,
            page=page,
            limit=limit,
            pages=total_pages,
            results=paginated_items
        )
