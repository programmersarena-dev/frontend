export default function LanguageMapper({language}) {
  if (language.startsWith('gcc')) return 'cpp';
  else if (language.startsWith('python')) return 'python';
  else if (language.startsWith('php')) return 'php';
  else if (language.startsWith('pascal')) return 'pascal';
  else if (language.startsWith('abc')) return 'abc';
  else if (language.startsWith('java')) return 'java';
  else if (language.startsWith('javascript')) return 'javascript';
  else {
    return 'cpp';
  }
}
