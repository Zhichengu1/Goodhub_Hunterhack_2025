from flask import Flask, render_template, request, redirect, url_for, make_response
import json
import time
from urllib.parse import urlencode
from flask_cors import CORS  # Import CORS for cross-origin support

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes to avoid browser security issues

# Sample user data for testing - in a real app, you'd use more secure storage
# This simulates our initial sample users
SAMPLE_USERS = {
    "admin": "admin123",
    "user": "password123"
}

@app.route("/")
def index_login():
    # Get the redirect URL if provided
    redirect_url = request.args.get('redirect_url', '')
    return render_template('login.html', redirect_url=redirect_url)

@app.route("/register")
def index_register():
    # Get the redirect URL if provided
    redirect_url = request.args.get('redirect_url', '')
    return render_template('register.html', redirect_url=redirect_url)

@app.route("/dashboard")
def dashboard():
    # Check if user is logged in via cookie
    username = request.cookies.get('username')
    if not username:
        return redirect(url_for('index_login'))
    
    # Get the redirect URL if provided (for the "Return to App" button)
    redirect_url = request.args.get('redirect_url', '')
    
    return render_template('dashboard.html', username=username, redirect_url=redirect_url)

@app.route("/login", methods=["POST"])
def login():
    username = request.form.get("username")
    password = request.form.get("password")
    redirect_url = request.form.get("redirect_url", '')
    
    # Get the stored users from cookies or use sample data if not available
    users_cookie = request.cookies.get('users')
    
    if users_cookie:
        users = json.loads(users_cookie)
    else:
        users = SAMPLE_USERS
    
    # Check if user exists and password matches
    if username in users and users[username] == password:
        # Check if we need to redirect to external app
        if redirect_url:
            # Create response with redirect to external app
            response = make_response(redirect(redirect_url))
            
            # Set user cookie
            response.set_cookie('username', username, max_age=3600)  # Expires in 1 hour
            
            return response
        else:
            # Create response with redirect to dashboard
            response = make_response(redirect(url_for('dashboard')))
            
            # Set user cookie
            response.set_cookie('username', username, max_age=3600)  # Expires in 1 hour
            
            return response
    else:
        # Provide feedback by redirecting with error parameters
        params = {}
        if redirect_url:
            params['redirect_url'] = redirect_url
            
        if username in users:
            params['error'] = 'password'
        else:
            params['error'] = 'user'
            
        return redirect(url_for('index_login', **params))

@app.route("/register", methods=["POST"])
def register():
    username = request.form.get("username")
    password = request.form.get("password")
    redirect_url = request.form.get("redirect_url", '')
    
    # Get the stored users from cookies or create new dictionary
    users_cookie = request.cookies.get('users')
    
    if users_cookie:
        users = json.loads(users_cookie)
    else:
        users = SAMPLE_USERS.copy()
    
    # Check if user already exists
    if username in users:
        params = {'error': 'exists'}
        if redirect_url:
            params['redirect_url'] = redirect_url
        return redirect(url_for('index_register', **params))
    
    # Add new user
    users[username] = password
    
    # Create response with redirect to login page with success parameter
    params = {'success': 'registered'}
    if redirect_url:
        params['redirect_url'] = redirect_url
        
    response = make_response(redirect(url_for('index_login', **params)))
    
    # Store updated users in cookie
    response.set_cookie('users', json.dumps(users), max_age=86400)  # Expires in 24 hours
    
    return response

@app.route("/logout")
def logout():
    # Get the redirect URL if provided
    redirect_url = request.args.get('redirect_url', '')
    
    # Create params for the redirect
    params = {'success': 'logout'}
    if redirect_url:
        params['redirect_url'] = redirect_url
    
    # Create response with redirect to login page
    response = make_response(redirect(url_for('index_login', **params)))
    
    # Remove username cookie
    response.set_cookie('username', '', expires=0)
    
    return response

if __name__ == '__main__':
    # Make sure to run on 0.0.0.0 to make it accessible from other devices
    app.run(debug=True, host='0.0.0.0', port=5000)