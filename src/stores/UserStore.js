import create from 'zustand';

const userStore = create((set) => ({
  user: {
    id: '',
    avatarUri: '',
    email: '',
    expenses: [],
    firstName: '',
    lastName: '',
    images: [],
    phoneNumber: '',
    trips: [],
  },
  setUserData: (data) => set(() => ({
    user: {
      id: data.id || null,
      avatarUri: data.avatarUri || null,
      email: data.email || null,
      expenses: data.expenses || null,
      firstName: data.firstName || null,
      lastName: data.lastName || null,
      images: data.images || null,
      phoneNumber: data.phoneNumber || null,
      trips: data.trips || null,
    },
  })),
  updateUser: (avatarUri) => set((state) => ({
    user: {
      ...state.user,
      avatarUri,
    },
  })),
}));

export default userStore;
