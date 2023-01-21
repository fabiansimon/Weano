import create from 'zustand';

const tripsStore = create((set) => ({
  trips: [],
  setTrips: (data) => set(() => ({
    trips: data,
  })),
  addTrip: (trip) => set((state) => ({
    trips: [...state.trips, trip],
  })),
}));

export default tripsStore;
