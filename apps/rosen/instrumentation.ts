export const register = async () => {
  try {
    console.log('!!!!!!!!!!!!!!!!! CWD in instrumentation: ', process.cwd);
  } catch (error) {
    console.warn('Ye etefaghe dige', error);
  }
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    import('./app/_backend/main');
  }
};
