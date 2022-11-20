export function setDataRefresh(key, minutes) {
  const setTime = new Date(new Date().getTime() + minutes * 60000);
  localStorage.setItem(key, setTime);
  return setTime;
}

export function serializeForm(elements) {
  const formData = {};

  elements.forEach((input) => {
    if (input.type === 'submit') return;

    if (input.type !== 'checkbox') {
      formData[input.name] = input.value;
    }

    if (input.type === 'checkbox') {
      formData[input.name] = input.checked;
    }
  });

  return formData;
}
