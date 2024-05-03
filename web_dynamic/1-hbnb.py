#!/usr/bin/python3
import uuid
from flask import Flask, render_template
from models import storage
from models.state import State
from models.city import City
from models.amenity import Amenity
from models.place import Place

app = Flask(__name__)

@app.teardown_appcontext
def close_db(error):
    """ Remove the current SQLAlchemy Session """
    storage.close()

@app.route('/1-hbnb/', strict_slashes=False)
def hbnb():
    """ HBNB with a dynamic filter """
    cache_id = str(uuid.uuid4())
    states = storage.all(State).values()
    states = sorted(states, key=lambda k: k.name)

    amenities = storage.all(Amenity).values()
    amenities = sorted(amenities, key=lambda k: k.name)

    places = storage.all(Place).values()
    places = sorted(places, key=lambda k: k.name)

    return render_template(
        '1-hbnb.html',
        cache_id=cache_id,
        states=states,
        amenities=amenities,
        places=places
    )

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
