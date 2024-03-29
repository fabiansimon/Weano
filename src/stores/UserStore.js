import create from 'zustand';

const userStore = create(set => ({
  user: {},
  setUserData: data =>
    set(() => ({
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
        pushToken: data.pushToken || null,
        friends: data.friends || null,
        countriesVisited: data.countriesVisited || null,
        isProMember: data.isProMember || null,
      },
    })),
  clearUserData: () =>
    set(() => ({
      user: {
        id: null,
        avatarUri: null,
        email: null,
        expenses: null,
        firstName: null,
        lastName: null,
        images: null,
        phoneNumber: null,
        trips: null,
        pushToken: null,
        friends: null,
        countriesVisited: null,
        isProMember: null,
      },
    })),
  updateUserData: data =>
    set(state => ({
      user: {
        authToken: data.authToken || state.user.authToken,
        id: data.id || state.user.id,
        avatarUri: data.avatarUri || state.user.avatarUri,
        email: data.email || state.user.email,
        expenses: data.expenses || state.user.expenses,
        firstName: data.firstName || state.user.firstName,
        lastName: data.lastName || state.user.lastName,
        images: data.images || state.user.images,
        phoneNumber: data.phoneNumber || state.user.phoneNumber,
        trips: data.trips || state.user.trips,
        pushToken: data.pushToken || state.user.pushToken,
        friends: data.friends || state.user.friends,
        countriesVisited: data.countriesVisited || state.user.countriesVisited,
        isProMember: data.isProMember || state.user.isProMember,
      },
    })),
}));

export default userStore;
