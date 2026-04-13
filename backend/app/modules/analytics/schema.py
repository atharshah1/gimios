from pydantic import BaseModel


class DashboardMetrics(BaseModel):
    attendance_rate: float
    revenue: int
    member_growth: int
    churn: int
    trainer_performance: float
