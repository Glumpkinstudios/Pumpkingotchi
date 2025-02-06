document.getElementById("form")!.onsubmit = (ev: SubmitEvent) => {
  ev.preventDefault();
  window.location.href = `${window.location.origin}${
    window.location.pathname
  }gotchi?channel=${
    (document.getElementById("sname") as HTMLInputElement).value
  }`;
};
