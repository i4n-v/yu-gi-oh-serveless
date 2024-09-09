"use client";
import { useEffect, useState } from "react";
import { graphQLClient } from "@/lib/graphql-client";
import { ICardArgs } from "../api/_types";
import { Transition } from "@headlessui/react";

const query = `
  query cards($page: Int!, $limit: Int!,$fname: String!) {
    cards(page: $page, limit: $limit,fname:$fname) {
      items {
        name
        type
        desc
        atk
        def
        level
        race
        attribute
        card_images {
          image_url
        }
        card_prices{
          tcgplayer_price
        }
      }
      totalPages
    }
  }
`;

export default function GraphQLRequest() {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCards, setShowCards] = useState<any>([]);
  const [cards, setCards] = useState<ICardArgs[]>([]);
  const [selectedCard, setSelectedCard] = useState<ICardArgs | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getCards = async () => {
    const variables = {
      page: page,
      limit: 10,
      fname: name,
    };
    try {
      setIsLoading(true);
      setShowCards([]);
      const response = await graphQLClient.request<any>(query, variables, {
        method: "POST",
      });
      if (response.cards) {
        setCards(response.cards.items);
        
        setTotalPages(response.cards.totalPages)
      }
    } catch (err) {
      console.error("ERROR FROM GRAPHQL-REQUEST API CALL", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let timeoutIds: NodeJS.Timeout[] = [];

    cards.forEach((card, index) => {
      const timeoutId = setTimeout(() => {
        setShowCards((prev: any) => [...prev, card.name]);
      }, index * 500);
      timeoutIds.push(timeoutId);
    });

    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, [cards]);

  useEffect(() => {
    getCards()
  },[page])

  const handleCardClick = (card: ICardArgs) => {
    setSelectedCard(card);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedCard(null);
  };

  return (
    <div className="flex w-full max-h-screen flex-col items-center gap-12 h-3/4">
      <div className="w-full h-1/5 flex align-center gap-4 max-w-lg p-6 top-0 left-0 right-0 mx-auto shadow-lg z-50">
        <input
          type="text"
          placeholder="Search..."
          onChange={(_event) => setName(_event.target.value)}
          className="w-full py-2 px-4 text-gray-700 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          onClick={getCards}
          className="px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Search
        </button>
      </div>
      {isLoading && (
        <div className="w-full h-screen flex justify-center items-center absolute">
          <Transition
            show={isLoading}
            enter="transition-opacity ease-in duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="border-t-transparent border-solid animate-spin rounded-full border-blue-500 border-4 h-12 w-12"></div>
          </Transition>
        </div>
      )}
      <div className="flex flex-wrap w-4/6 gap-4 h-2/5">
        {cards?.map((card, index) => (
          <Transition
            key={index}
            as="div"
            show={showCards.includes(card.name)}
            enter="transition-opacity transform duration-500 ease-in-out"
            enterFrom="opacity-0 scale-90"
            enterTo="opacity-100 scale-110"
            className="inline-block w-2/12 h-fit"
          >
            <div
              key={index}
              className="border border-gray-300 max-h-full rounded-lg overflow-hidden transition-transform duration-300 hover:scale-110 cursor-pointer hover:shadow-lg"
              onClick={() => handleCardClick(card)}
            >
              <img
                src={card.card_images?.[0]?.image_url}
                alt={card.name}
                className="w-full h-auto"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{card.name}</h3>
                <p className="text-gray-500">{card.type}</p>
              </div>
            </div>
          </Transition>
        ))}
        
      </div>
      {!!cards.length && (
          <div className="flex justify-between items-center w-full max-w-5xl mt-6">
            <button
              disabled={page === 1}
              className={`px-4 py-2 bg-blue-500 text-white rounded-lg transition ${
                page === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-600"
              }`}
              onClick={() => {
                setPage(page - 1)
              }}
            >
              Anterior
            </button>
            <span className="text-lg">
              Página {page} de {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              className={`px-4 py-2 bg-blue-500 text-white rounded-lg transition ${
                page === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-600"
              }`}
              onClick={() => {
                setPage(page + 1)
              }}
            >
              Próximo
            </button>
          </div>
        )}
      {/* Dialog Component */}
      {isDialogOpen && selectedCard && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-6xl w-full">
            <div className="flex justify-end">
              <button
                onClick={closeDialog}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition mb-4"
              >
                Fechar
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex justify-center items-center">
                <img
                  src={selectedCard?.card_images?.[0]?.image_url}
                  alt={selectedCard.name}
                  className="w-full h-auto object-cover hover:scale-150 max-w-md"
                />
              </div>
              <div className="flex flex-col gap-y-10 text-black">
                <h2 className="text-2xl font-bold text-center mb-2">
                  {selectedCard.name}
                </h2>
                <div className="flex justify-between">
                  <div>
                    <span className="font-semibold">Type:</span>{" "}
                    {selectedCard.type}
                  </div>
                  <div>
                    <span className="font-semibold">Market Price:</span>
                    {" $"}
                    {selectedCard.card_prices[0].tcgplayer_price}
                  </div>
                </div>
                <p className="mb-2">{selectedCard.desc}</p>
                {selectedCard?.type?.toLowerCase().includes("monster") && (
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div>
                      <span className="font-semibold">ATK:</span>{" "}
                      {selectedCard.atk}
                    </div>
                    <div>
                      <span className="font-semibold">DEF:</span>{" "}
                      {selectedCard.def}
                    </div>
                    <div>
                      <span className="font-semibold">Level:</span>{" "}
                      {selectedCard.level}
                    </div>
                    <div>
                      <span className="font-semibold">Race:</span>{" "}
                      {selectedCard.race}
                    </div>
                    <div>
                      <span className="font-semibold">Attribute:</span>{" "}
                      {selectedCard.attribute}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
