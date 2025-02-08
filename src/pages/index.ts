const form = document.getElementById('form') as HTMLFormElement;
const customSizeContainer = document.getElementById(
  'custom-size-container'
) as HTMLDivElement;
const urlInput = document.getElementById('url') as HTMLInputElement;
const navigateButton = document.getElementById(
  'navigate-button'
) as HTMLButtonElement;
const copyButton = document.getElementById('copy-button') as HTMLButtonElement;

let url = '';
function onFormChange() {
  const formData = new FormData(form);
  const sizeFormData = formData.get('size')?.toString();

  customSizeContainer.style.display =
    sizeFormData === 'custom' ? 'block' : 'none';

  const size =
    sizeFormData === 'custom'
      ? `${formData.get('custom-size-width')}x${formData.get('custom-size-height')}`
      : sizeFormData;

  const urlParamsObj: Record<string, string> = Object.fromEntries(
    Object.entries({
      channel: formData.get('sname')?.toString(),
      size: size?.toString(),
      transparent: formData.has('transparent') ? 'true' : undefined,
    }).filter((entry) => entry[1] !== undefined) as [string, string][]
  );

  url = `${window.location.href}gotchi?${new URLSearchParams(urlParamsObj).toString()}`;

  urlInput.value = url;
}

onFormChange();
form.onchange = () => {
  onFormChange();
};

form.onsubmit = (ev: SubmitEvent) => {
  ev.preventDefault();
  const formData = new FormData(form);
  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }
};

copyButton.onclick = () => {
  urlInput.select();
  urlInput.setSelectionRange(0, 99999);

  navigator.clipboard.writeText(urlInput.value);
};

navigateButton.onclick = () => {
  window.open(urlInput.value, '_blank');
};
