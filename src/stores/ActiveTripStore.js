import create from 'zustand';

const activeTripStore = create(set => ({
  activeTrip: {},
  setActiveTrip: data =>
    set(() => ({
      activeTrip: {
        id: data.id || null,
        hostId: data.hostId || null,
        thumbnailUri: data.thumbnailUri || null,
        title: data.title || null,
        description: data.description || null,
        // location: data.location || null,
        destinations: data.destinations || null,
        expenses: data.expenses || null,
        activeMembers: data.activeMembers || null,
        dateRange: data.dateRange || null,
        images: data.images || null,
        polls: data.polls || null,
        mutualTasks: data.mutualTasks || null,
        privateTasks: data.privateTasks || null,
        userFreeImages: data.userFreeImages || null,
        type: data.type || null,
        documents: data.documents || null,
        packingItems: data.packingItems || null,
        currency: !data?.currency?.string
          ? {
              symbol: '$',
              string: 'USD',
            }
          : data.currency,
      },
    })),
  updateActiveTrip: data =>
    set(state => ({
      activeTrip: {
        id: data.id || state.activeTrip.id,
        hostId: data.hostId || state.activeTrip.hostId,
        thumbnailUri: data.thumbnailUri || state.activeTrip.thumbnailUri,
        title: data.title || state.activeTrip.title,
        description: data.description || state.activeTrip.description,
        // location: data.location || state.activeTrip.location,
        destinations: data.destinations || state.activeTrip.destinations,
        expenses: data.expenses || state.activeTrip.expenses,
        activeMembers: data.activeMembers || state.activeTrip.activeMembers,
        dateRange: data.dateRange || state.activeTrip.dateRange,
        images: data.images || state.activeTrip.images,
        polls: data.polls || state.activeTrip.polls,
        mutualTasks: data.mutualTasks || state.activeTrip.mutualTasks,
        privateTasks: data.privateTasks || state.activeTrip.privateTasks,
        userFreeImages:
          data.userFreeImages !== undefined
            ? data.userFreeImages
            : state.activeTrip.userFreeImages,
        type: data.type || state.activeTrip.type,
        documents: data.documents || state.activeTrip.documents,
        packingItems: data.packingItems || state.activeTrip.packingItems,
        currency: data.currency || state.activeTrip.currency,
      },
    })),
}));

export default activeTripStore;
