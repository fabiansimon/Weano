import create from 'zustand';

const activeTripStore = create((set) => ({
  activeTrip: {},
  setActiveTrip: (data) => set((state) => ({
    activeTrip: {
      id: data.id || state.id || null,
      thumbnailUri: data.thumbnailUri || state.thumbnailUri || null,
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
//   updateUser: (avatarUri) => set((state) => ({
//     user: {
//       ...state.user,
//       avatarUri,
//     },
//   })),
}));

export default activeTripStore;
