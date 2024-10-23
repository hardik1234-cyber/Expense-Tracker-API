from fastapi.testclient import TestClient
from xpense_tracker.main import app

client = TestClient(app=app)

def test_start():
    response = client.get('/')
    assert response.status_code == 200
    # assert response ==  "Hello World"

