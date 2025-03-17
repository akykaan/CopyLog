export const useWindowManager = () => {
  const minimize = () => {
    window.electron?.minimizeWindow();
  };

  const maximize = () => {
    window.electron?.maximizeWindow();
  };

  const close = () => {
    window.electron?.closeWindow();
  };

  return { minimize, maximize, close };
};
