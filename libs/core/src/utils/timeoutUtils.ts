export function timeout(ms: number) {
  console.log('Calling setTimeout');
  return new Promise((resolve) => setTimeout(resolve, ms));
}
