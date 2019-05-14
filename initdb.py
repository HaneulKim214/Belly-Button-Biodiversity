# Creates postgres db in heroku
from Belly-Button-Biodiversity.app import db

# db.drop_all()
db.create_all()
