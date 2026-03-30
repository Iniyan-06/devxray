from fastapi import FastAPI, HTTPException # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from pydantic import BaseModel # type: ignore
from typing import Optional, Any, Dict, List
import requests # type: ignore
from datetime import datetime
import os
from motor.motor_asyncio import AsyncIOMotorClient # type: ignore
from bson import ObjectId # type: ignore
import json
from openai import OpenAI # type: ignore
from dotenv import load_dotenv # type: ignore

load_dotenv()

# OpenAI Setup
client_openai = None
if os.getenv("OPENAI_API_KEY"):
    client_openai = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Setup
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URI)
db = client.devxray
collection = db.scan_results

# Helper to serialize MongoDB docs
def serialize_doc(doc):
    if not doc:
        return None
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Since it's a local tool
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RepoRequest(BaseModel):
    owner: str
    repo: str
    token: Optional[str] = None

@app.get("/")
def root():
    return {"message": "DevX-Ray Backend Running 🚀"}


@app.post("/github-ci")
async def get_ci_data(request: RepoRequest):
    owner = request.owner
    repo = request.repo
    token = request.token

    url = f"https://api.github.com/repos/{owner}/{repo}/actions/runs"

    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "DevXRay-App"
    }
    
    if token:
        headers["Authorization"] = f"token {token}"
    elif os.getenv("GITHUB_TOKEN"):
        headers["Authorization"] = f"token {os.getenv('GITHUB_TOKEN')}"

    response = requests.get(url, headers=headers)
    
    if response.status_code == 404:
        raise HTTPException(status_code=404, detail="Repository not found")
    if response.status_code == 403:
        raise HTTPException(status_code=403, detail="GitHub API rate limit reached")
    if response.status_code == 401:
        raise HTTPException(status_code=401, detail="Unauthorized - Check your token")
    
    if not response.ok:
        raise HTTPException(status_code=response.status_code, detail="GitHub API Error")

    data = response.json()
    runs = data.get("workflow_runs", [])

    if not runs:
        # Check if the repo exists but has no workflows
        test_url = f"https://api.github.com/repos/{owner}/{repo}"
        test_res = requests.get(test_url, headers=headers)
        if test_res.ok:
             raise HTTPException(status_code=422, detail="No CI/CD workflows found in this repository")

    total_time: float = 0.0
    count: int = 0

    # ✅ Calculate duration using timestamps
    for run in runs:
        created = run.get("created_at")
        updated = run.get("updated_at")

        if created and updated:
            start = datetime.fromisoformat(created.replace("Z", "+00:00"))
            end = datetime.fromisoformat(updated.replace("Z", "+00:00"))

            duration = (end - start).total_seconds() * 1000  # ms

            total_time += duration # type: ignore
            count += 1 # type: ignore

    avg_time: float = (total_time / count) / 1000.0 if count > 0 else 0.0 # type: ignore

    daily_runs: int = 10
    weekly_time: float = avg_time * daily_runs * 7 / 3600.0

    # 💥 Optimization simulation
    optimized_time: float = avg_time * 0.7
    optimized_weekly: float = optimized_time * daily_runs * 7 / 3600.0
    time_saved: float = weekly_time - optimized_weekly

    # 🤖 Real AI Insights Integration
    ai_insights: List[Dict[str, str]] = [
        {"severity": "CRITICAL", "problem": "Build lattice latency", "fix": "Enable caching"},
        {"severity": "WARNING", "problem": "Redundant tests", "fix": "Parallelize jobs"}
    ]

    if client_openai:
        try:
            prompt = f"""
            Analyze CI/CD workflow data for {owner}/{repo}:
            - Avg Build: {float(avg_time):.2f}s
            - Weekly Waste: {float(weekly_time):.2f}h
            - Total Runs: {count}
            
            Provide 2-3 specific, professional AI fix suggestions as JSON.
            Format: {{"insights": [{{"severity": "CRITICAL|WARNING|INFO", "problem": "...", "fix": "..."}}]}}
            """
            ai_res = client_openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "system", "content": "You are a DevOps optimization expert."},
                          {"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            ai_data = json.loads(ai_res.choices[0].message.content)
            if "insights" in ai_data:
                ai_insights = ai_data["insights"]
        except Exception as e:
            print(f"AI Insight Error: {e}")

    avg_build_time_val = float("{:.2f}".format(float(avg_time)))
    weekly_waste_val = float("{:.2f}".format(float((avg_build_time_val * count) / 3600)))
    optimization_savings_val = float("{:.2f}".format(float(weekly_waste_val * 0.4)))
    
    if avg_build_time_val < 60:
        score_base = 90
    elif avg_build_time_val < 120:
        score_base = 75
    elif avg_build_time_val < 300:
        score_base = 55
    else:
        score_base = 30
        
    bottleneck_list = ["Build Artifact" if avg_build_time_val > 100 else "Unit Tests"]
    xray_score_val = max(10, min(100, int(score_base - (len(bottleneck_list) * 5))))

    # ✅ Prepare Result for DB
    result: Dict[str, Any] = {
        "owner": owner,
        "repo": repo,
        "scanned_at": datetime.utcnow().isoformat(),
        
        # New Strict Fields
        "avg_build_time": avg_build_time_val,
        "weekly_waste": weekly_waste_val,
        "optimization_savings": optimization_savings_val,
        "xray_score": xray_score_val,
        "total_runs": count,
        "bottlenecks": bottleneck_list, 
        "ai_insights": ai_insights,
        
        # Legacy Fields (kept for history/compatibility)
        "avg_build_time_sec": avg_build_time_val,
        "estimated_weekly_time_waste_hours": float("{:.2f}".format(float(weekly_time))), # type: ignore
        "optimized_build_time_sec": float("{:.2f}".format(float(optimized_time))), # type: ignore
        "optimized_weekly_hours": float("{:.2f}".format(float(optimized_weekly))), # type: ignore
        "estimated_time_saved_hours": float("{:.2f}".format(float(time_saved))), # type: ignore
        "total_runs_analyzed": count
    }

    # Save to MongoDB
    try:
        await collection.insert_one(dict(result))
    except Exception as e:
        print(f"DB Error: {e}")

    avg_build_time = avg_build_time_val
    return {
        **result,
        "weekly_waste": float("{:.2f}".format(float((avg_build_time * 30) / 3600))), # type: ignore
        "optimization_savings": float("{:.2f}".format(float((avg_build_time * 30) / 3600 * 0.4))), # type: ignore
        "xray_score": max(10, min(100, (90 if float(result.get("avg_build_time", 0)) < 60 else 75 if float(result.get("avg_build_time", 0)) < 120 else 55 if float(result.get("avg_build_time", 0)) < 300 else 30) - len(result.get("bottlenecks", [])) * 5)) # type: ignore
    }

@app.post("/workflow-runs")
def get_workflow_runs(request: RepoRequest):
    owner = request.owner
    repo = request.repo
    token = request.token

    url = f"https://api.github.com/repos/{owner}/{repo}/actions/runs"
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "DevXRay-App"
    }
    
    if token:
        headers["Authorization"] = f"token {token}"
    elif os.getenv("GITHUB_TOKEN"):
        headers["Authorization"] = f"token {os.getenv('GITHUB_TOKEN')}"

    response = requests.get(url, headers=headers)
    
    if not response.ok:
        raise HTTPException(status_code=response.status_code, detail="GitHub API Error")

    data = response.json()
    runs = data.get("workflow_runs", [])

    history = []
    for run in runs[:20]:  # Limit to 20 latest for performance
        history.append({
            "name": run.get("name"),
            "status": run.get("status"),
            "conclusion": run.get("conclusion"),
            "created_at": run.get("created_at")
        })

    result: Dict[str, Any] = {}
    avg_build_time = 120 # Fallback for minimal endpoints that do not calculate this
    return {
        "owner": owner,
        "repo": repo,
        "total_count": data.get("total_count", 0),
        "runs": history,
        "weekly_waste": float("{:.2f}".format(float((avg_build_time * 30) / 3600))), # type: ignore
        "optimization_savings": float("{:.2f}".format(float((avg_build_time * 30) / 3600 * 0.4))), # type: ignore
        "xray_score": max(10, min(100, (90 if float(result.get("avg_build_time", 0)) < 60 else 75 if float(result.get("avg_build_time", 0)) < 120 else 55 if float(result.get("avg_build_time", 0)) < 300 else 30) - len(result.get("bottlenecks", [])) * 5)) # type: ignore
    }



@app.get("/ci-data")
def get_ci_data_minimal(owner: str, repo: str):
    url = f"https://api.github.com/repos/{owner}/{repo}/actions/runs"
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "DevXRay-App"
    }
    if os.getenv("GITHUB_TOKEN"):
        headers["Authorization"] = f"token {os.getenv('GITHUB_TOKEN')}"

    response = requests.get(url, headers=headers)
    
    if response.status_code == 404:
        raise HTTPException(status_code=404, detail="Repository not found")
    
    if not response.ok:
        raise HTTPException(status_code=response.status_code, detail="GitHub API Error")

    data = response.json()
    runs = data.get("workflow_runs", [])

    # Extract latest 5 runs with specific fields
    latest_runs = []
    for run in runs[:5]:
        latest_runs.append({
            "workflow_name": run.get("name"),
            "status": run.get("status"),
            "conclusion": run.get("conclusion"),
            "created_at": run.get("created_at")
        })

    result: Dict[str, Any] = {}
    avg_build_time = 120 # Fallback for minimal endpoints that do not calculate this
    return {
        "owner": owner,
        "repo": repo,
        "latest_runs": latest_runs,
        "weekly_waste": float("{:.2f}".format(float((avg_build_time * 30) / 3600))), # type: ignore
        "optimization_savings": float("{:.2f}".format(float((avg_build_time * 30) / 3600 * 0.4))), # type: ignore
        "xray_score": max(10, min(100, (90 if float(result.get("avg_build_time", 0)) < 60 else 75 if float(result.get("avg_build_time", 0)) < 120 else 55 if float(result.get("avg_build_time", 0)) < 300 else 30) - len(result.get("bottlenecks", [])) * 5)) # type: ignore
    }


@app.get("/analyze-waste")
def analyze_ci_waste(owner: str, repo: str):
    url = f"https://api.github.com/repos/{owner}/{repo}/actions/runs"
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "DevXRay-App"
    }
    if os.getenv("GITHUB_TOKEN"):
        headers["Authorization"] = f"token {os.getenv('GITHUB_TOKEN')}"

    response = requests.get(url, headers=headers)
    
    if response.status_code == 404:
        raise HTTPException(status_code=404, detail="Repository not found")
    
    if not response.ok:
        raise HTTPException(status_code=response.status_code, detail="GitHub API Error")

    data = response.json()
    runs = data.get("workflow_runs", [])
    
    if not runs:
        raise HTTPException(status_code=422, detail="No workflow runs found to analyze")

    durations = []
    slowest_run_val = 0
    slowest_run_name = "N/A"

    for run in runs:
        # Use run_started_at if available, otherwise fallback to created_at
        start_str = run.get("run_started_at") or run.get("created_at")
        end_str = run.get("updated_at")

        if start_str and end_str:
            start = datetime.fromisoformat(start_str.replace("Z", "+00:00"))
            end = datetime.fromisoformat(end_str.replace("Z", "+00:00"))
            
            duration_min = (end - start).total_seconds() / 60
            durations.append(duration_min)

            if duration_min > slowest_run_val:
                slowest_run_val = duration_min
                slowest_run_name = run.get("name", "Unknown Workflow")

    total_runs = len(durations)
    if total_runs == 0:
         raise HTTPException(status_code=422, detail="Unable to calculate durations for available runs")

    avg_build_time = sum(durations) / total_runs
    
    # Estimate weekly runs
    weekly_runs_estimate = 50 
    weekly_time_waste_hours = (avg_build_time * weekly_runs_estimate) / 60

    insight = "CI pipeline is relatively healthy but has room for optimization."
    if avg_build_time > 10:
        insight = "CI pipeline is inefficient and causing significant developer time loss."
    elif avg_build_time > 5:
        insight = "Pipeline duration is moderate; minor bottlenecks detected."

    result: Dict[str, Any] = {}
    return {
        "average_build_time": f"{float(avg_build_time):.2f} minutes", # type: ignore
        "total_runs": str(total_runs),
        "weekly_time_waste_hours": f"{float(weekly_time_waste_hours):.2f} hours", # type: ignore
        "slowest_run": f"{slowest_run_name} ({float(slowest_run_val):.2f} min)", # type: ignore
        "insight": insight,
        "weekly_waste": float("{:.2f}".format(float((avg_build_time * 30) / 3600))), # type: ignore
        "optimization_savings": float("{:.2f}".format(float((avg_build_time * 30) / 3600 * 0.4))), # type: ignore
        "xray_score": max(10, min(100, (90 if float(result.get("avg_build_time", 0)) < 60 else 75 if float(result.get("avg_build_time", 0)) < 120 else 55 if float(result.get("avg_build_time", 0)) < 300 else 30) - len(result.get("bottlenecks", [])) * 5)) # type: ignore
    }


@app.get("/simulate-optimization")
def simulate_ci_optimization(owner: str, repo: str):
    url = f"https://api.github.com/repos/{owner}/{repo}/actions/runs"
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "DevXRay-App"
    }
    if os.getenv("GITHUB_TOKEN"):
        headers["Authorization"] = f"token {os.getenv('GITHUB_TOKEN')}"

    response = requests.get(url, headers=headers)
    
    if not response.ok:
        raise HTTPException(status_code=response.status_code, detail="GitHub API Error")

    data = response.json()
    runs = data.get("workflow_runs", [])
    
    if not runs:
        raise HTTPException(status_code=422, detail="No workflow runs found to analyze")

    durations = []
    for run in runs:
        start_str = run.get("run_started_at") or run.get("created_at")
        end_str = run.get("updated_at")
        if start_str and end_str:
            start = datetime.fromisoformat(start_str.replace("Z", "+00:00"))
            end = datetime.fromisoformat(end_str.replace("Z", "+00:00"))
            durations.append((end - start).total_seconds() / 60)

    if not durations:
        raise HTTPException(status_code=422, detail="Unable to calculate durations")

    avg_time = sum(durations) / len(durations)
    weekly_runs = 50 # Baseline estimate
    
    current_weekly_waste = (avg_time * weekly_runs) / 60
    
    # Simulation Logic
    optimized_avg = avg_time * 0.8 * 0.7
    optimized_weekly_waste = (optimized_avg * weekly_runs) / 60
    time_saved = current_weekly_waste - optimized_weekly_waste

    result: Dict[str, Any] = {}
    avg_build_time = avg_time
    return {
        "current_weekly_waste_hours": f"{float(current_weekly_waste):.2f} hours", # type: ignore
        "optimized_weekly_waste_hours": f"{float(optimized_weekly_waste):.2f} hours", # type: ignore
        "time_saved_hours": f"{float(time_saved):.2f} hours", # type: ignore
        "improvements": [
            "Enable dependency caching (20% faster)",
            "Use parallel jobs in CI (30% faster)"
        ],
        "weekly_waste": float("{:.2f}".format(float((avg_build_time * 30) / 3600))), # type: ignore
        "optimization_savings": float("{:.2f}".format(float((avg_build_time * 30) / 3600 * 0.4))), # type: ignore
        "xray_score": max(10, min(100, (90 if float(result.get("avg_build_time", 0)) < 60 else 75 if float(result.get("avg_build_time", 0)) < 120 else 55 if float(result.get("avg_build_time", 0)) < 300 else 30) - len(result.get("bottlenecks", [])) * 5)) # type: ignore
    }


@app.get("/ai-insights")
def get_ai_insights(owner: str, repo: str):
    url = f"https://api.github.com/repos/{owner}/{repo}/actions/runs"
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "DevXRay-App"
    }
    if os.getenv("GITHUB_TOKEN"):
        headers["Authorization"] = f"token {os.getenv('GITHUB_TOKEN')}"

    response = requests.get(url, headers=headers)
    if not response.ok:
        raise HTTPException(status_code=response.status_code, detail="GitHub API Error")

    data = response.json()
    runs = data.get("workflow_runs", [])
    if not runs:
        raise HTTPException(status_code=422, detail="No workflow runs found")

    durations = []
    for run in runs:
        start_str = run.get("run_started_at") or run.get("created_at")
        end_str = run.get("updated_at")
        if start_str and end_str:
            start = datetime.fromisoformat(start_str.replace("Z", "+00:00"))
            end = datetime.fromisoformat(end_str.replace("Z", "+00:00"))
            durations.append((end - start).total_seconds() / 60)

    avg_time = sum(durations) / len(durations) if durations else 0
    weekly_waste = (avg_time * 50) / 60
    time_saved = weekly_waste - ((avg_time * 0.56 * 50) / 60)

    # Insight Logic (Simulated AI)
    problem = "CI pipeline is inefficient due to long build times"
    if avg_time > 10:
        problem = f"Critical build latency detected in the {repo} repository"
    elif avg_time < 3:
        problem = "CI pipeline is efficient, but minor optimizations can still be claimed"

    impact = f"Developers are losing {float(weekly_waste):.1f} hours per week waiting for builds"
    if weekly_waste > 8:
        impact = f"Major productivity drain: {float(weekly_waste):.1f} hours lost weekly per developer team"

    result: Dict[str, Any] = {}
    avg_build_time = avg_time
    return {
        "problem": problem,
        "impact": impact,
        "fixes": [
            "Enable Docker layer caching to speed up image builds",
            "Parallelize test execution across multiple containers",
            "Optimize CI triggers to avoid unnecessary runs"
        ],
        "expected_improvement": f"Implementing these fixes can reduce total CI latency by 35–45%, saving ~{float(time_saved):.1f} hours weekly.", # type: ignore
        "weekly_waste": float("{:.2f}".format(float((avg_build_time * 30) / 3600))), # type: ignore
        "optimization_savings": float("{:.2f}".format(float((avg_build_time * 30) / 3600 * 0.4))), # type: ignore
        "xray_score": max(10, min(100, (90 if float(result.get("avg_build_time", 0)) < 60 else 75 if float(result.get("avg_build_time", 0)) < 120 else 55 if float(result.get("avg_build_time", 0)) < 300 else 30) - len(result.get("bottlenecks", [])) * 5)) # type: ignore
    }

# --- NEW HISTORY ENDPOINTS ---

@app.get("/history")
async def get_history():
    cursor = collection.find().sort("scanned_at", -1).limit(20)
    history = []
    async for doc in cursor:
        history.append(serialize_doc(doc))
    return history

@app.get("/history/{owner}/{repo}")
async def get_repo_history(owner: str, repo: str):
    cursor = collection.find({"owner": owner, "repo": repo}).sort("scanned_at", -1)
    history = []
    async for doc in cursor:
        history.append(serialize_doc(doc))
    return history

@app.delete("/history/{id}")
async def delete_history(id: str):
    try:
        res = await collection.delete_one({"_id": ObjectId(id)})
        if res.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Result not found")
        return {"message": "Deleted successfully"}
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID format")
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
