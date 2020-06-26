const initializeSettingCheckbox = () => {
  const checkboxImagePrevent = document.querySelector('#image-prevent');
  checkboxImagePrevent.addEventListener('click', () => {
    localStorage.setItem('prevent-image', checkboxImagePrevent.checked);
  });

  checkboxImagePrevent.checked =
    localStorage.getItem('prevent-image') === 'true';

  const checkboxAutoRefresh = document.querySelector('#auto-refresh');
  checkboxAutoRefresh.addEventListener('click', () => {
    localStorage.setItem('auto-refresh', checkboxAutoRefresh.checked);
  });

  checkboxAutoRefresh.checked = localStorage.getItem('auto-refresh') === 'true';
};

initializeSettingCheckbox();
