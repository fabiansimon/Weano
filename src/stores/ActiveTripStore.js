import create from 'zustand';

const activeTripStore = create((set) => ({
  activeTrip: {},
  setActiveTrip: (data) => set(() => ({
    activeTrip: {
      id: data.id || null,
      thumbnailUri: data.thumbnailUri || null,
      title: data.title || null,
      description: data.description || null,
      location: data.location || null,
      expenses: data.expenses || null,
      activeMembers: data.activeMembers || null,
      invitees: data.invitees || null,
      dateRange: data.dateRange || null,
      images: data.images || null,
    },
  })),
  updateActiveTrip: (data) => set((state) => ({
    activeTrip: {
      id: data.id || state.activeTrip.id,
      thumbnailUri: data.thumbnailUri || state.activeTrip.thumbnailUri,
      title: data.title || state.activeTrip.title,
      description: data.description || state.activeTrip.description,
      location: data.location || state.activeTrip.location,
      expenses: data.expenses || state.activeTrip.expenses,
      activeMembers: data.activeMembers || state.activeTrip.activeMembers,
      invitees: data.invitees || state.activeTrip.invitees,
      dateRange: data.dateRange || state.activeTrip.dateRange,
      images: data.images || state.activeTrip.images,
    },
  })),
}));

export default activeTripStore;
