DATABASE_URL = 'postgres+psycopg2://<USERNAME>:<PASSWORD>@<IP_ADDRESS>:<PORT>/<DATABASE_NAME>'

SEED_DATA = True    # Whether to clear the current database tables and add users
TEST_SERVER = True  # If database is being seeded, decides whether to create 
                    # example elections and questions

MEMBERSHIP_API = '' # Host Port for the membership portal 

headers = {
  'Content-Type': 'application/json'
}
payload = {
    'email':'', # Membership Portal account email
    'password': '' # Membership Portal account password
}

# Membership Portal Login
token_response = requests.post(MEMBERSHIP_API + 'api/v1/auth/login', data = json.dumps(payload), headers=headers)
token_json =  token_response.json()

TOKEN = { # Token to access Membership Portal requests
    'Content-Type': 'application/json',
    "Authorization": "Bearer " + token_json['token']
}