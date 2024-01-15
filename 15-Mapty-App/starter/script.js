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
const resetBtn = document.querySelector('.reset-btn');

let map, mapEvent;

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
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    const coords = [lat, long];

    this._map = L.map('map').setView(coords, 15);

    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright',
    }).addTo(this._map);

    this._map.on('click', this._showForm.bind(this));
    this._displayWorkouts();
    this._displayWorkoutMarkers();
  }

  _showForm(e) {
    this._mapEvent = e;
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
        +inputCadence.value
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
        +inputElevation.value
      );
    }

    this._setLocalStorage(workout);
    this._renderWorkout(workout);
    this._renderWorkoutMarker(workout);
    // Clear input fields and hide form
    this._hideForm(e);
  }

  _setLocalStorage(workout) {
    this._getLocalStorage();
    this.workouts.push(workout);
    localStorage.setItem('workouts', JSON.stringify(this.workouts));
  }

  _getLocalStorage() {
    this.workouts = JSON.parse(localStorage.getItem('workouts')) || [];
  }

  _renderWorkout(workout) {
    const html = `
    <li class="workout workout--${workout.name}" data-id="${workout.id}">
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
        workout.name === 'running'
          ? workout.pace.toFixed(2)
          : workout.speed.toFixed(2)
      }</span>
      <span class="workout__unit">${
        workout.name === 'running' ? 'min/km' : 'km/h'
      }</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">${
        workout.name === 'running' ? '🦶🏼' : '⛰'
      }</span>
      <span class="workout__value">${
        workout.name === 'running' ? workout.cadence : workout.elevationGain
      }</span>
      <span class="workout__unit">${
        workout.name === 'running' ? 'spm' : 'm'
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
          className: [`${workout.name}-popup`],
        })
      )
      .setPopupContent(
        `${workout.name === 'running' ? '🏃🏻‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
  }

  _displayWorkouts() {
    this.workouts.forEach(workout => {
      this._renderWorkout(workout);
    });
  }

  _displayWorkoutMarkers() {
    this.workouts.forEach(workout => {
      this._renderWorkoutMarker(workout);
    });
  }

  reset() {
    localStorage.removeItem('workouts');
    document.location.reload();
  }
}

///////////////////////////////////////
class Workout {
  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, long]
    this.distance = distance; // in km
    this.duration = duration; // in min
    this.date = new Date();
    this.id = (Date.now() + '').slice(-10);
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
    console.log(this.description);
    // this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
    //   this.date
    // }`;
  }
}

class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);

    this.name = 'running';
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
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);

    this.name = 'cycling';
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

const app = new App();

// if (navigator.geolocation) {
//   navigator.geolocation.getCurrentPosition(
//     position => {
//       let lat = position.coords.latitude;
//       let long = position.coords.longitude;
//       console.log(position.coords.latitude, position.coords.longitude);
//       //   console.log(position); // position object
//       // create google maps link
//       //   console.log(
//       //     `https://www.google.com/maps/@${position.coords.latitude},${position.coords.longitude}`
//       //   );
//       // Leaflet library
//       const map = L.map('map').setView([lat, long], 13);

//       L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution:
//           '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//       }).addTo(map);

//       L.marker([lat, long])
//         .addTo(map)
//         .bindPopup('A pretty CSS popup.<br> Easily customizable.')
//         .openPopup();
//     },
//     err => {
//       alert('Could not get your position, error: ' + err.message);
//     }
//   );
// }

///////////////////////////////////////
// Leaflet library - Marker
