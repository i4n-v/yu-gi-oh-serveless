import { AxiosInstance } from "axios";

type GraphQLContext = {
  axios: AxiosInstance;
};

interface ICardArgs {
  page?: number;
  limit?: number;
  id?: number;
  name?: string;
  desc?: string;
  fname?: string;
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
  card_images?: {
    id: number;
    image_url: string;
    image_url_small: string;
    image_url_cropped: string;
  }[];
  card_prices: {
    cardmarket_price: string;
    tcgplayer_price: string;
    ebay_price: string;
    amazon_price: string;
    coolstuffinc_price: string;
  }[];
  has_effect?: boolean;
}

export type { GraphQLContext, ICardArgs };
