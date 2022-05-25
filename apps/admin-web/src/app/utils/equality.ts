export function objectsEqual(o1: any, o2: any): boolean {
  return typeof o1 === 'object' && Object.keys(o1).length > 0
    ? Object.keys(o1).length === Object.keys(o2).length &&
        Object.keys(o1).every((p) => objectsEqual(o1[p], o2[p]))
    : o1 === o2;
}

export function arraysEqual<T>(a1: T[], a2: T[]): boolean {
  return (
    a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]))
  );
}
