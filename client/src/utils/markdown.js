export const stripMarkdown = (text) => {
  if (!text) return '';
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1') // remove bold asterisks
    .replace(/__([^_]+)__/g, '$1')     // remove bold underscores
    .replace(/\*([^*]+)\*/g, '$1')     // remove italic asterisks
    .replace(/_([^_]+)_/g, '$1')       // remove italic underscores
    .replace(/`([^`]+)`/g, '$1')       // remove code backticks
    .replace(/^\s*[-*+]\s+/gm, '• ')   // change bullet lists to bullet symbol
    .replace(/^\s*#+\s+/gm, '')        // remove headers markers
    .replace(/[*_#`~]/g, '');          // strip any stray markdown characters
};
