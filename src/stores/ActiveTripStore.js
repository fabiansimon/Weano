import create from 'zustand';

const activeTripStore = create((set) => ({
  activeTrip: {},
  setActiveTrip: (data) => set(() => ({
    activeTrip: {
      id: data.id || null,
      title: data.title || null,
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
