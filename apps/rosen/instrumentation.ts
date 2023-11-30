try {
  console.log('!!!!!!!!!!!!!!!!! CWD in instrumentation: ', process.cwd);
} catch (error) {
  console.warn('Ye etefaghe dige', error);
}

export const register = async () => {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    import('./app/_backend/main');
  }
};
