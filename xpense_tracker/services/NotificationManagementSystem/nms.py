from fastapi import APIRouter,Depends,status,HTTPException,Response
from sqlmodel import Session, select
from xpense_tracker.database.database_connection import get_session


nms_router = APIRouter(tags=['Notification Management System'])

@nms_router.post('/notifications/subscribe',status_code=status.HTTP_200_OK)
def subscribe_to_notifications():
    pass