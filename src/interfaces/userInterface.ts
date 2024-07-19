export interface IUser {
  name: string,
  email: string,
  picture?: string | null
}

export interface IUserHeaders {
  api_key: string
}

export interface IUserResponse {
  name: string,
  email: string,
  picture?: string | null,
  createdAt: Date
}
