const form = document.getElementById('form') as HTMLFormElement;
const customSizeContainer = document.getElementById(
  'custom-size-container'
) as HTMLDivElement;
const urlInput = document.getElementById('url') as HTMLInputElement;
const copyButton = document.getElementById('copy-button') as HTMLButtonElement;
const useRewardRedeem = document.getElementById(
  'use-roll-reward'
) as HTMLInputElement;
const rewardRedeemContainer = document.getElementById(
  'roll-reward-container'
) as HTMLDivElement;
const useBangCommand = document.getElementById(
  'use-roll-command'
) as HTMLInputElement;
const bangCommandContainer = document.getElementById(
  'roll-command-container'
) as HTMLDivElement;

let url = '';
function onFormChange() {
  const formData = new FormData(form);
  const formDataSize = formData.get('size')?.toString();

  customSizeContainer.style.display =
    formDataSize === 'custom' ? 'block' : 'none';

  rewardRedeemContainer.style.display = useRewardRedeem.checked
    ? 'block'
    : 'none';
  bangCommandContainer.style.display = useBangCommand.checked
    ? 'block'
    : 'none';

  const size =
    formDataSize === 'custom'
      ? `${formData.get('custom-size-width')}x${formData.get('custom-size-height')}`
      : formDataSize;

  const rollRewardTitle = useRewardRedeem.checked
    ? formData.get('roll-reward-title')?.toString() || 'Gotchi Gatcha'
    : undefined;

  const rollCommand = useBangCommand.checked
    ? formData.get('roll-command')?.toString() || '!gotchi roll'
    : undefined;

  const urlParamsObj: Record<string, string> = Object.fromEntries(
    Object.entries({
      channel: formData.get('sname')?.toString(),
      size: size?.toString(),
      transparent: formData.has('transparent') ? 'true' : undefined,
      blacklist: formData
        .get('blacklist')
        ?.toString()
        .split('\n')
        ?.map((line) => line.trim())
        ?.filter((line) => line.length > 0)
        ?.join(', '),
      rollRewardTitle,
      rollCommand,
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
  window.open(urlInput.value, '_blank');
};

copyButton.onclick = () => {
  urlInput.select();
  urlInput.setSelectionRange(0, 99999);

  navigator.clipboard.writeText(urlInput.value);
};
