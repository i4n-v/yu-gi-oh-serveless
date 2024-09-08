import { AxiosInstance } from "axios";

type GraphQLContext = {
  axios: AxiosInstance;
};

interface ICardArgs {
  page?: number;
  limit?: number;
  id?: number;
  name?: string;
  type?: string;
  atk?: number;
  def?: number;
  level?: number;
  race?: string;
  attribute?: string;
  cardset?: string;
  archetype?: string;
  banlist?: string;
  sort?: string;
  has_effect?: boolean;
}

export type { ICardArgs, GraphQLContext };
