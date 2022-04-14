// Opens a new tab and avoids a major security flaw with _blank https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/
export const openInNewTab = (url: string): void => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  if (newWindow) newWindow.opener = null;
};

export const openJsonInNewTab = (data: object): void => {
  const _data = JSON.stringify(data);
  const w = window.open();
  if (w) {
    w.document.write('<html><body><pre>' + _data + '</pre></body></html>');
    w.document.close();
  }
};
