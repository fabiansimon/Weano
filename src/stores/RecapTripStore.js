import create from 'zustand';

const recapTripStore = create((set) => ({
  recapTrip: {},
  setRecapTrip: (data) => set(() => ({
    recapTrip: {
      id: data.id || null,
      thumbnailUri: data.thumbnailUri || null,
      title: data.title || null,
      description: data.description || null,
      location: data.location || null,
      expenses: data.expenses || null,
      activeMembers: data.activeMembers || null,
      dateRange: data.dateRange || null,
      images: data.images || null,
      polls: data.polls || null,
      mutualTasks: data.mutualTasks || null,
      privateTasks: data.privateTasks || null,
    },
  })),
  updateRecapTrip: (data) => set((state) => ({
    recapTrip: {
      id: data.id || state.activeTrip.id,
      thumbnailUri: data.thumbnailUri || state.activeTrip.thumbnailUri,
      title: data.title || state.activeTrip.title,
      description: data.description || state.activeTrip.description,
      location: data.location || state.activeTrip.location,
      expenses: data.expenses || state.activeTrip.expenses,
      activeMembers: data.activeMembers || state.activeTrip.activeMembers,
      dateRange: data.dateRange || state.activeTrip.dateRange,
      images: data.images || state.activeTrip.images,
      polls: data.polls || state.activeTrip.polls,
      mutualTasks: data.mutualTasks || state.activeTrip.mutualTasks,
      privateTasks: data.privateTasks || state.activeTrip.privateTasks,
    },
  })),
}));

export default recapTripStore;
