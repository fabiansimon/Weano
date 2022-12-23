import create from 'zustand';

const tripsStore = create((set) => ({
  trips: [],
  setTrips: (data) => set(() => ({
    trips: data.map((trip) => ({
      id: trip.id || null,
      thumbnailUri: trip.thumbnailUri || null,
      title: trip.title || null,
      description: trip.description || null,
      location: trip.location || null,
      activeMembers: data.activeMembers || null,
      dateRange: trip.dateRange || null,
    })),
  })),
  updateTripAtIndex: (data, index) => set((state) => ({
    trips: state.trips.map((trip, i) => (i === index ? {
      trip: {
        id: data.id || state.trips[i].id,
        thumbnailUri: data.thumbnailUri || state.trips[i].thumbnailUri,
        title: data.title || state.trips[i].title,
        description: data.description || state.trips[i].description,
        location: data.location || state.trips[i].location,
        activeMembers: data.activeMembers || state.trips[i].activeMembers,
        dateRange: data.dateRange || state.trips[i].dateRange,
      },
    } : trip)),
  })),
  addTrip: (trip) => set((state) => ({
    trips: [...state.trips, trip],
  })),
}));

export default tripsStore;
