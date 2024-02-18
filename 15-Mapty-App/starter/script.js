'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const sortBtn = document.querySelectorAll('.sort-button');
const resetBtn = document.querySelector('.reset-btn');

/*
  The Main App Class
*/
class App {
  constructor(
    markerPopupOptions = {
      maxWidth: 250,
      minWidth: 100,
      autoClose: false,
      closeOnClick: false,
      className: 'running-popup',
    }
  ) {
    this.markerPopupOptions = markerPopupOptions;
    this._map;
    this._mapEvent;
    this._getPosition();
    this._getLocalStorage();
    // this._displayWorkouts();
    // this._displayWorkoutMarkers();

    // Event listeners
    form.addEventListener('submit', this._newWorkout.bind(this));
    document.addEventListener('DOMContentLoaded', this._toggleElevationField);
    inputType.addEventListener('change', this._toggleElevationField);
    // containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
    containerWorkouts.addEventListener(
      'click',
      this._handleWorkoutClick.bind(this)
    );
    sortBtn.forEach(el => {
      // if (el.classList.contains('hidden')) return;
      el.addEventListener('click', this._sortWorkouts.bind(this));
    });
    resetBtn.addEventListener('click', this.reset);
  }

  _getPosition() {
    let position;
    if (navigator.geolocation) {
      position = navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        err => {
          alert(
            `Error: ${err.message}\n\nPlease allow location access to use this app.`
          );
        }
      );
    }

    return position;
  }

  _loadMap(position) {
    const showAllWorkouts = this._showAllWorkouts.bind(this);
    const locate = this._locate.bind(this);
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    const coords = [lat, long];

    // TODO: Refactor (together with other functionalities) out of this function
    //  to the constructor func. where it will server as optional inputs
    const customIcon = L.icon({
      iconUrl: 'icon.png',
      iconSize: [50, 50],
      iconAnchor: [25, 50],
      popupAnchor: [0, -50],
    });
    const latlng = new L.LatLng(lat, long);

    this._map = L.map('map').setView(coords, 15);
    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright',
    }).addTo(this._map);

    L.marker(latlng, { icon: customIcon }).addTo(this._map);

    // TODO: Refactor out of this function
    // Create a new control with a button
    const ViewControl = L.Control.extend({
      options: {
        position: 'topright', // position of the control
      },

      onAdd: function (map) {
        const container = L.DomUtil.create(
          'div',
          'leaflet-bar leaflet-control leaflet-control-custom'
        );

        const button = L.DomUtil.create('button', '', container);
        button.innerHTML = 'Show all';

        // these two can be refactored into one function
        // TODO: Refactor
        const showAllWorkoutsFunction = function () {
          showAllWorkouts();
          button.innerHTML = 'Locate';
          button.onclick = locateFunction;
        };

        // TODO: Refactor
        const locateFunction = function () {
          locate(); // don't we currently have get location function? Can't we do better?
          button.innerHTML = 'Fit bounds';
          button.onclick = showAllWorkoutsFunction;
        };

        button.onclick = showAllWorkoutsFunction;

        // button.onclick = function () {
        //   // Call your fitBounds method here
        //   console.log(self);
        //   fitBounds();
        // };

        return container;
      },
    });

    this._map.addControl(new ViewControl());
    this._map.on('click', this._showForm.bind(this));
    this._displayWorkouts();
    this._displayWorkoutMarkers();
    // this._displaySortForm();
  }

  _showForm(e) {
    this._mapEvent = e;
    // check if e is event object or Running or Cycling object
    if (e.constructor.name === 'Running' || e.constructor.name === 'Cycling') {
      console.log('not event');
      this._mapEvent.latlng = {
        lat: this._mapEvent.coords[0],
        lng: this._mapEvent.coords[1],
      };
    }

    form.classList.remove('hidden');
    inputDistance.focus();
  }
  _hideForm(e) {
    form.classList.add('hidden');
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
  }

  _toggleElevationField() {
    if (inputType.value === 'running') {
      inputCadence.closest('.form__row').classList.remove('form__row--hidden');
      inputElevation.closest('.form__row').classList.add('form__row--hidden');
    } else if (inputType.value === 'cycling') {
      inputElevation
        .closest('.form__row')
        .classList.remove('form__row--hidden');
      inputCadence.closest('.form__row').classList.add('form__row--hidden');
    }
  }

  _newWorkout(e) {
    e.preventDefault();
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    const { lat, lng } = this._mapEvent.latlng;
    const coords = [lat, lng];
    let workout;

    let optionalInputs = {};
    if (this._mapEvent.id) {
      optionalInputs = {
        date: this._mapEvent.date,
        id: this._mapEvent.id,
      };
    }

    console.log('optionalInputs');
    console.log(optionalInputs);

    if (inputType.value === 'running') {
      if (
        !validInputs(
          +inputDistance.value,
          +inputDuration.value,
          +inputDistance.value
        ) ||
        !allPositive(
          +inputDistance.value,
          +inputDuration.value,
          +inputCadence.value
        )
      ) {
        return alert('Inputs have to be positive numbers!');
      }

      workout = new Running(
        coords,
        +inputDistance.value,
        +inputDuration.value,
        +inputCadence.value,
        optionalInputs
      );
    }
    if (inputType.value === 'cycling') {
      if (
        !validInputs(
          +inputDistance.value,
          +inputDuration.value,
          +inputElevation.value
        ) ||
        !allPositive(
          +inputDistance.value,
          +inputDuration.value
          // +inputElevation.value
        )
      ) {
        return alert('Inputs have to be positive numbers!');
      }

      workout = new Cycling(
        coords,
        +inputDistance.value,
        +inputDuration.value,
        +inputElevation.value,
        optionalInputs
      );
    }

    console.log('workout');
    console.log(workout);

    this._setLocalStorage(workout, true);
    this._renderWorkout(workout);
    this._renderWorkoutMarker(workout);
    // Clear input fields and hide form
    this._hideForm(e);
  }

  _setLocalStorage(workout, replace = false) {
    // if (replace) {
    //   this.workouts.splice(
    //     this.workouts.findIndex(w => w.id === workout.id),
    //     1,
    //     workout
    //   );
    // } else {
    if (!Array.isArray(workout) || replace) {
      this._getLocalStorage();
      const index = this.workouts.findIndex(w => w.id === workout.id);
      if (index !== -1) {
        this.workouts.splice(index, 1, workout);
      } else {
        this.workouts.push(workout);
      }
      localStorage.setItem('workouts', JSON.stringify(this.workouts));
    } else {
      localStorage.setItem('workouts', JSON.stringify(this.workouts));
    }
    // }
  }

  _getLocalStorage() {
    this.workouts = JSON.parse(localStorage.getItem('workouts')) || [];
    this.workouts = this.workouts.map(workout => {
      if (workout.type === 'running') {
        workout = Object.assign(new Running(), workout);
      }
      if (workout.type === 'cycling') {
        workout = Object.assign(new Cycling(), workout);
      }

      return workout;
    });
  }

  _renderWorkout(workout) {
    const html = `
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
    <button class="edit-btn">&#9998;</button>
    <button class="delete-btn">X</button>
    <h2 class="workout__title">${workout.description}</h2>
    <div class="workout__details">
      <span class="workout__icon">${
        workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
      }</span>
      <span class="workout__value">${workout.distance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱️</span>
      <span class="workout__value">${workout.duration}</span>
      <span class="workout__unit">min</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${
        workout.type === 'running'
          ? workout.pace.toFixed(2)
          : workout.speed.toFixed(2)
      }</span>
      <span class="workout__unit">${
        workout.type === 'running' ? 'min/km' : 'km/h'
      }</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">${
        workout.type === 'running' ? '🦶🏼' : '⛰'
      }</span>
      <span class="workout__value">${
        workout.type === 'running' ? workout.cadence : workout.elevationGain
      }</span>
      <span class="workout__unit">${
        workout.type === 'running' ? 'spm' : 'm'
      }</span>
    `;

    form.insertAdjacentHTML('afterend', html);
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this._map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: [`${workout.name}-popup workout-id-${workout.id}`],
          autoPan: false, // don't move to the last popup when loading the page
        })
      )
      .setPopupContent(
        `${workout.name === 'running' ? '🏃🏻‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
  }

  _displayWorkouts(reverse = false) {
    if (!reverse) {
      this.workouts.forEach(workout => {
        this._renderWorkout(workout);
      });
    } else {
      const workoutEls = document.querySelectorAll('.workouts > li');
      workoutEls.forEach(el => {
        el.remove();
      });
    }
  }

  _displayWorkoutMarkers() {
    this.workouts.forEach(workout => {
      this._renderWorkoutMarker(workout);
    });
  }

  _handleWorkoutClick(e) {
    const workoutEl = e.target.closest('.workout');
    if (!workoutEl) return;

    const workout = this.workouts.find(w => w.id === workoutEl.dataset.id);
    if (!workout) return;

    // delete workout
    if (e.target.classList.contains('delete-btn')) {
      this.workouts.splice(this.workouts.indexOf(workout), 1);
      localStorage.setItem('workouts', JSON.stringify(this.workouts));

      document.location.reload();
      return;
    }
    // edit workout
    if (e.target.classList.contains('edit-btn')) {
      workoutEl.remove();
      this._showForm(workout);

      return;
    }

    if (!this._map) return;
    this._map.setView(workout.coords, 15, {
      animate: true,
      pan: {
        duration: 1,
      },
    });

    return;
  }

  _sortWorkouts(e) {
    let sortType = e.target.parentElement.querySelector('select').value;
    const desc = e.target.classList.contains('descending');

    const sortedWorkouts = this.workouts.sort((a, b) => {
      let retOp;
      // check the direction of the sort
      if (!desc) {
        [a, b] = [b, a];
      }
      // check the sort type
      if (sortType === 'type') {
        [a, b] = [b, a];
        retOp = a.type.localeCompare(b.type); // compare strings using localeCompare
      } else if (sortType === 'cadence-elevation') {
        sortType = 'cadence' || 'elevationGain';
        retOp = a.cadence || a.elevationGain - b.cadence || b.elevationGain;
      } else if (sortType === 'date') {
        retOp = new Date(a.date) - new Date(b.date);
      } else {
        retOp = a[sortType] - b[sortType];
      }

      return retOp;
    });

    // switch the hidden class
    const sibling =
      e.target.nextElementSibling || e.target.previousElementSibling;

    e.target.classList.toggle('hidden');
    sibling.classList.toggle('hidden');

    // remove all workouts
    this._displayWorkouts(true);
    // display sorted workouts
    this._displayWorkouts();

    // set it as the new workouts to local storage
    this._setLocalStorage(sortedWorkouts, false);
  }

  _showAllWorkouts() {
    let bounds = L.latLngBounds(this.workouts.map(workout => workout.coords));
    this._map.fitBounds(bounds);
  }

  _locate() {
    this._map.locate({ setView: true, maxZoom: 16 });
  }

  reset() {
    localStorage.removeItem('workouts');
    document.location.reload();
  }
}

/*
  The Workout Class
*/
class Workout {
  constructor(coords, distance, duration, optionalInputs = {}) {
    this.coords = optionalInputs.coords || coords; // [lat, long]
    this.distance = distance; // in km
    this.duration = duration; // in min
    if (optionalInputs.date) {
      this.date = optionalInputs.date;
      this.date = new Date(this.date);
    } else {
      this.date = new Date();
    }
    this.id = optionalInputs.id || (Date.now() + '').slice(-10);
  }

  _setDescription() {
    const formattedDate = new Intl.DateTimeFormat(navigator.language, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(this.date);
    this.description = `${this.name[0].toUpperCase()}${this.name.slice(
      1
    )} on ${formattedDate}`;
    // this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
    //   this.date
    // }`;
  }
}

/*
  The Running & Cycling Classes
*/
class Running extends Workout {
  constructor(coords, distance, duration, cadence, optionalInputs = {}) {
    super(coords, distance, duration, optionalInputs);

    this.name = 'Running';
    this.type = 'running';
    this.cadence = cadence; // in steps/min
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, elevationGain, optionalInputs = {}) {
    super(coords, distance, duration, optionalInputs);

    this.type = 'cycling';
    this.name = 'Cycling';
    this.elevationGain = elevationGain; // in m
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// Create a new app
const app = new App();
