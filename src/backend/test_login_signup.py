import requests

BASE = "http://localhost:8000"

# Test signup
signup_resp = requests.post(f"{BASE}/candidate/signup", json={"email": "testuser@example.com", "password": "testpass"})
print("Signup:", signup_resp.status_code, signup_resp.json())

# Test login with correct password
login_resp = requests.post(f"{BASE}/candidate/login", json={"email": "testuser@example.com", "password": "testpass"})
print("Login (correct):", login_resp.status_code, login_resp.json())

# Test login with wrong password
login_resp_wrong = requests.post(f"{BASE}/candidate/login", json={"email": "testuser@example.com", "password": "wrongpass"})
print("Login (wrong):", login_resp_wrong.status_code, login_resp_wrong.json())

# Test login with non-existent email
login_resp_none = requests.post(f"{BASE}/candidate/login", json={"email": "nouser@example.com", "password": "testpass"})
print("Login (non-existent):", login_resp_none.status_code, login_resp_none.json())
