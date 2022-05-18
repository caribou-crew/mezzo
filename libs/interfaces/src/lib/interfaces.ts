export type Fetch = (
  input: RequestInfo,
  init?: RequestInit
) => Promise<Response>;

// Network record/response types
