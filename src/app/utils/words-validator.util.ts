const forbiddenWords: string[] = ['cat', 'dog', 'yes', 'no'];

export function checkContainsForbiddenWord(value: string): boolean {
  for (let i = 0; i < forbiddenWords.length; i++) {
    if (value.includes(forbiddenWords[i])) {
      return true;
    }
  }
  return false;
}
