import requests

BASE = "https://workwise-recruitment-platform.onrender.com"

def test_post(endpoint, payload, label):
    try:
        resp = requests.post(f"{BASE}{endpoint}", json=payload, timeout=10)
        try:
            data = resp.json()
        except Exception:
            data = resp.text
        print(f"{label}:", resp.status_code, data)
    except Exception as e:
        print(f"{label}: Network error or timeout.", str(e))

# Test signup
test_post("/candidate/signup", {"email": "testuser@example.com", "password": "testpass"}, "Signup")

# Test login with correct password
test_post("/candidate/login", {"email": "testuser@example.com", "password": "testpass"}, "Login (correct)")

# Test login with wrong password
test_post("/candidate/login", {"email": "testuser@example.com", "password": "wrongpass"}, "Login (wrong)")

# Test login with non-existent email
test_post("/candidate/login", {"email": "nouser@example.com", "password": "testpass"}, "Login (non-existent)")
