from fastapi import APIRouter


rms_router = APIRouter(tags=['Reprting Management System'])


@rms_router.get('/')
def start():
    print("hello")