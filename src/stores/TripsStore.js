import create from 'zustand';

const tripsStore = create(set => ({
  trips: [],
  setTrips: data =>
    set(() => ({
      trips: data,
    })),
  addTrip: trip =>
    set(state => ({
      trips: [...state.trips, trip],
    })),
  removeTrip: id =>
    set(state => ({
      trips: state.trips.filter(trip => trip.id !== id),
    })),
}));

export default tripsStore;
