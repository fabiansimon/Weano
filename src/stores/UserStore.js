import create from 'zustand';

const userStore = create((set) => ({
  user: {
    firstName: 'Fabian',
    lastName: 'Fabian',
    email: 'fabian.simon98@gmail.',
  },
  setUserData: (data) => set(() => ({
    user: {
      firstName: data.firstName || null,
      lastName: data.lastName || null,
      email: data.email || null,
      phoneNumber: data.phoneNumber || null,
      avatarUri: data.avatarUri || null,
      images: data.images || null,
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
