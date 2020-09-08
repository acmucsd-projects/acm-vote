DATABASE_URL = 'postgres+psycopg2://<USERNAME>:<PASSWORD>@<IP_ADDRESS>:<PORT>/<DATABASE_NAME>'

SEED_DATA = True    # Whether to clear the current database tables and add users
TEST_SERVER = True  # If database is being seeded, decides whether to create 
                    # example elections and questions

MEMBERSHIP_API = '' # Host Port for the membership portal 
