export interface Year {
  id: string;
  name: string;
}

export interface CreateYearRequest {
  name: string;
}

export interface UpdateYearRequest {
  id: string;
  name?: string;
}
