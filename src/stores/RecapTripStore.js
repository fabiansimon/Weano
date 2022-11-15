import create from 'zustand';

const recapTripStore = create((set) => ({
  recapTrip: {
    id: '',
    title: '',
    location: '',
    expenses: [],
    activeMembers: [],
    invitees: [],
    dateRange: {
      startRange: 0,
      endDate: 0,
    },
    images: [],
  },
  setRecapTrip: (data) => set(() => ({
    recapTrip: {
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
//   updateUser: (avatarUri) => set((state) => ({
//     user: {
//       ...state.user,
//       avatarUri,
//     },
//   })),
}));

export default recapTripStore;
