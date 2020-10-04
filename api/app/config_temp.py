DATABASE_URL = 'postgres+psycopg2://<USERNAME>:<PASSWORD>@<IP_ADDRESS>:<PORT>/<DATABASE_NAME>'

SEED_DATA = True    # Whether to clear the current database tables and add users
TEST_SERVER = True  # If database is being seeded, decides whether to create 
                    # example elections and questions

MEMBERSHIP_API = '' # Host Port for the membership portal 

# JWT used for admin account on Membership Portal API to seed user data on database
#
# This needs to be acquired manually, and can be done so at the route:
# POST {MEMBERSHIP_API}/api/v2/auth/login
# Content-Type: application/json
#
# You'll need to supply a JSON in the body with "email" and "password" properties
# with the user credentials. The returning JSON's "token" property will contain
# the necessary information.
TOKEN =
