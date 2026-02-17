import requests
import json

# Register
reg_resp = requests.post("http://localhost:8000/auth/register",
    json={"email": f"test{hash('test')}@test.com", "password": "Pass123"})
token = reg_resp.json()['access_token']
print(f"Token: {token[:30]}...")

# Create task
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {token}"
}
task_data = {"title": "Test Task"}

print(f"\nCreating task with data: {task_data}")
create_resp = requests.post("http://localhost:8000/api/tasks",
    json=task_data, headers=headers)

print(f"Status: {create_resp.status_code}")
print(f"Response: {create_resp.text}")

# Try listing
list_resp = requests.get("http://localhost:8000/api/tasks", headers=headers)
print(f"\nList Status: {list_resp.status_code}")
print(f"List Response: {list_resp.text}")
