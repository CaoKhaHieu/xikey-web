export const urlify = (content: string) => {
  if (!content) {
    return '';
  }
  let replacedText;

  //URLs starting with http://, https://, or ftp://
  const replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  replacedText = content.replace(replacePattern1, '<a class=\'message-content-link text-blue\' href="$1" target="_blank">$1</a>');

  //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
  const replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  replacedText = replacedText.replace(replacePattern2, '$1<a class=\'message-content-link text-blue\' href="http://$2" target="_blank">$2</a>');

  //Change email addresses to mailto:: links.
  const replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
  replacedText = replacedText.replace(replacePattern3, '<a class=\'message-content-link text-blue\' href="mailto:$1">$1</a>');

  return replacedText;
};
