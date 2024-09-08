const typeDefs = `
  type Query {
    card(
      name: String,
      id: Int,
      type: String,
      atk: Int,
      def: Int,
      level: Int,
      race: String,
      attribute: String,
      cardset: String,
      archetype: String,
      banlist: String,
      sort: String,
      has_effect: Boolean,
    ): [Card]!
  }

  type Card {
    id: Int!
    name: String!
    typeline: [String]!
    type: String!
    humanReadableCardType: String!
    frameType: String!
    desc: String!
    race: String!
    atk: Int!
    def: Int!
    level: Int!
    attribute: String!
    ygoprodeck_url: String!
    card_sets: [CardSet]
    card_images: [CardImages]!
    card_prices: [CardPrices]!
  }

  type CardSet {
    set_name: String!
    set_code: String!
    set_rarity: String!
    set_rarity_code: String!
    set_price: String!
  }

  type CardImages {
    id: Int!
    image_url: String!
    image_url_small: String!
    image_url_cropped: String!
  }

  type CardPrices {
    cardmarket_price: String!
    tcgplayer_price: String!
    ebay_price: String!
    amazon_price: String!
    coolstuffinc_price: String!
  }
`;

export default typeDefs;
