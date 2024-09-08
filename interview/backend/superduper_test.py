from superduperdb import superduper
from superduperdb.backends.mongodb import Collection

mongodb_uri = "mongomock://test"
artifact_store = 'filesystem://./my'


db = superduper(mongodb_uri, artifact_store=artifact_store)

my_collection = Collection("documents")