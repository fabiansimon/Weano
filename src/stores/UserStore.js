import create from 'zustand';

const userStore = create((set) => ({
  user: {
    firstName: 'Fabian',
    lastName: 'Fabian',
    email: 'fabian.simon98@gmail.',
  },
  updateFirstName: (firstName) => set((state) => ({
    user: {
      ...state,
      firstName,
    },
  })),
}));

export default userStore;
