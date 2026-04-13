from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from api.agent import router as agent_router
from api.rules import router as rules_router
from api.health import router as health_router

app = FastAPI(
    title="ChatBiz Agent API",
    description="三阶段AI Agent服务（售前/售中/售后）",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 静态文件
STATIC_DIR = Path(__file__).parent / "static"
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# 挂载路由
app.include_router(agent_router)
app.include_router(rules_router)
app.include_router(health_router)


@app.get("/")
async def root():
    return FileResponse(str(STATIC_DIR / "test.html"))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
