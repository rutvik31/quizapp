export default {
  data() {
    return {
      gridApi: null,
      filters: {},
      pagination: {
        page: 1,
        perPage: 10,
      },
      totalPages: 0,
      debounceTimer: null,
    };
  },
};
