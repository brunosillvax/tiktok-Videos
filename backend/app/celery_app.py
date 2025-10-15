from celery import Celery
import os
import structlog

logger = structlog.get_logger()

# Get broker and backend URLs from environment or defaults
broker_url = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
result_backend = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")

logger.info("Celery configuration", broker=broker_url, backend=result_backend)

# Create Celery instance
celery_app = Celery(
    "autoreel",
    broker=broker_url,
    backend=result_backend,
    include=[
        "app.tasks.monitoring_tasks",
        "app.tasks.posting_tasks",
        "app.tasks.maintenance_tasks"
    ]
)

# Celery configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=300,  # 5 minutes
    task_soft_time_limit=240,  # 4 minutes
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
    result_expires=3600,  # 1 hour
    beat_schedule={
        "monitor-profiles": {
            "task": "app.tasks.monitoring_tasks.monitor_all_profiles",
            "schedule": 300.0,  # Every 5 minutes
        },
        "cleanup-old-logs": {
            "task": "app.tasks.maintenance_tasks.cleanup_old_logs",
            "schedule": 86400.0,  # Daily
        },
        "update-proxy-stats": {
            "task": "app.tasks.maintenance_tasks.update_proxy_statistics",
            "schedule": 3600.0,  # Hourly
        },
        "refresh-tiktok-tokens": {
            "task": "app.tasks.maintenance_tasks.refresh_expired_tiktok_tokens",
            "schedule": 1800.0,  # Every 30 minutes
        },
    },
)

logger.info("Celery app configured successfully")
