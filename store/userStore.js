export const state = () => ({
  user: []
});

export const mutations = {
  token(state, value) {
    state.user.push(value);
  }
};
