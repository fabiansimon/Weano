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
  updateUserData: (data) => set((state) => ({
    user: {
      id: data.id || state.user.id,
      avatarUri: data.avatarUri || state.user.avatarUri,
      email: data.email || state.user.email,
      expenses: data.expenses || state.user.expenses,
      firstName: data.firstName || state.user.firstName,
      lastName: data.lastName || state.user.lastName,
      images: data.images || state.user.images,
      phoneNumber: data.phoneNumber || state.user.phoneNumber,
      trips: data.trips || state.user.trips,
    },
  })),
}));

export default userStore;
