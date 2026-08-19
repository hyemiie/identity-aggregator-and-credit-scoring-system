// SpatialIndex.jsx

import {
  useState,
  useMemo,
} from "react";

import DraggableCard
  from "./DraggableCard";

import Connections
  from "./Connections";

import {
  person,
  coreCards,
  countries,
} from "./data";

import "./spatial-index.css";


export default function SpatialIndex() {

  /*
   * Person position.
   *
   * This is the anchor for
   * the entire constellation.
   */

  const [
    personPosition,
    setPersonPosition,
  ] = useState(person);


  /*
   * Core card positions.
   */

  const [
    cards,
    setCards,
  ] = useState(coreCards);


  /*
   * Selected countries.
   *
   * This is an ARRAY because
   * we allow multiple countries
   * to be checked simultaneously.
   */

  const [
    selectedCountries,
    setSelectedCountries,
  ] = useState([]);


  /*
   * Dynamic country/provider
   * positions.
   */

  const [
    dynamicNodes,
    setDynamicNodes,
  ] = useState({});


  /*
   * --------------------------------
   * MOVE CORE CARD
   * --------------------------------
   */

  function moveCard(
    id,
    x,
    y
  ) {
    setCards((current) =>
      current.map((card) =>
        card.id === id
          ? {
              ...card,
              x,
              y,
            }
          : card
      )
    );
  }


  /*
   * --------------------------------
   * MOVE PERSON
   * --------------------------------
   *
   * When PERSON moves, every node
   * moves by the same delta.
   */

  function movePerson(
    id,
    newX,
    newY
  ) {
    const deltaX =
      newX -
      personPosition.x;

    const deltaY =
      newY -
      personPosition.y;


    /*
     * Move person.
     */

    setPersonPosition(
      (current) => ({
        ...current,
        x: newX,
        y: newY,
      })
    );


    /*
     * Move all core cards.
     */

    setCards((current) =>
      current.map((card) => ({
        ...card,

        x:
          card.x +
          deltaX,

        y:
          card.y +
          deltaY,
      }))
    );


    /*
     * Move country/provider nodes.
     */

    setDynamicNodes(
      (current) => {
        const next = {};

        Object.entries(
          current
        ).forEach(
          ([countryId, nodes]) => {

            next[countryId] = {
              country: {
                ...nodes.country,

                x:
                  nodes.country.x +
                  deltaX,

                y:
                  nodes.country.y +
                  deltaY,
              },

              providers:
                nodes.providers.map(
                  (provider) => ({
                    ...provider,

                    x:
                      provider.x +
                      deltaX,

                    y:
                      provider.y +
                      deltaY,
                  })
                ),
            };
          }
        );

        return next;
      }
    );
  }


  /*
   * --------------------------------
   * MOVE DYNAMIC NODE
   * --------------------------------
   */

  function moveDynamicNode(
    countryId,
    nodeId,
    x,
    y
  ) {
    setDynamicNodes(
      (current) => {
        const existing =
          current[countryId];

        if (!existing) {
          return current;
        }


        /*
         * Country itself
         */

        if (
          existing.country.id ===
          nodeId
        ) {
          return {
            ...current,

            [countryId]: {
              ...existing,

              country: {
                ...existing.country,

                x,
                y,
              },
            },
          };
        }


        /*
         * Provider
         */

        return {
          ...current,

          [countryId]: {
            ...existing,

            providers:
              existing.providers.map(
                (provider) =>
                  provider.id === nodeId
                    ? {
                        ...provider,
                        x,
                        y,
                      }
                    : provider
              ),
          },
        };
      }
    );
  }


  /*
   * --------------------------------
   * COUNTRY CHECKBOX
   * --------------------------------
   */

  function toggleCountry(
    countryId
  ) {
    setSelectedCountries(
      (current) => {

        /*
         * Uncheck
         */

        if (
          current.includes(countryId)
        ) {
          return current.filter(
            (id) =>
              id !== countryId
          );
        }


        /*
         * Check
         */

        return [
          ...current,
          countryId,
        ];
      }
    );


    /*
     * If we're opening the country
     * for the first time, create its
     * nodes.
     */

    if (
      !selectedCountries.includes(
        countryId
      )
    ) {
      createCountryNodes(
        countryId
      );
    }
  }


  /*
   * --------------------------------
   * CREATE COUNTRY NODES
   * --------------------------------
   */

  function createCountryNodes(
    countryId
  ) {
    const country =
      countries[countryId];


    if (!country) {
      return;
    }


    /*
     * Find Identity.
     */

    const identity =
      cards.find(
        (card) =>
          card.id === "identity"
      );


    if (!identity) {
      return;
    }


    /*
     * Put country next to Identity.
     */

    const countryX =
      identity.x + 170;


    const countryY =
      identity.y;


    /*
     * Put providers below
     * the country.
     */

    const providers =
      country.providers.map(
        (provider, index) => ({
          ...provider,

          kind: "provider",

          x:
            countryX +
            (index * 135),

          y:
            countryY +
            100,
        })
      );


    setDynamicNodes(
      (current) => ({
        ...current,

        [countryId]: {
          country: {
            id: country.id,

            kind: "country",

            name:
              country.name,

            description:
              country.description,

            x: countryX,

            y: countryY,
          },

          providers,
        },
      })
    );
  }


  /*
   * --------------------------------
   * COUNTRY NODE DATA
   * --------------------------------
   */

  const activeCountryNodes =
    useMemo(() => {

      const result = [];


      selectedCountries.forEach(
        (countryId) => {

          const nodes =
            dynamicNodes[countryId];


          if (!nodes) {
            return;
          }


          result.push({
            countryId,

            ...nodes,
          });
        }
      );


      return result;

    }, [
      selectedCountries,
      dynamicNodes,
    ]);


  return (
    <main className="spatial-index">

      
{/* 
      <header className="spatial-index__header">

        <span>
          IDENTITY / RISK
        </span>

        <h1>
          Know who
          <br />
          you're trusting.
        </h1>

      </header> */}


      {/* =================================
          COUNTRY FILTER
      ================================= */}

      <CountryFilter
        selectedCountries={
          selectedCountries
        }

        onToggle={
          toggleCountry
        }
      />


      {/* =================================
          CANVAS
      ================================= */}

      <div className="spatial-index__canvas">


        {/* =================================
            CONNECTIONS
        ================================= */}

        {activeCountryNodes.map(
          (nodes) => (
            <Connections
              key={
                nodes.countryId
              }

              cards={cards}

              person={
                personPosition
              }

              activeCountry={
                countries[
                  nodes.countryId
                ]
              }

              countryNodes={{
                identity:
                  cards.find(
                    (card) =>
                      card.id ===
                      "identity"
                  ),

                country:
                  nodes.country,

                providers:
                  nodes.providers,
              }}
            />
          )
        )}


        {/* =================================
            CORE CONNECTIONS
        ================================= */}

        <Connections
          cards={cards}
          person={
            personPosition
          }
        />


        {/* =================================
            PERSON
        ================================= */}

        <DraggableCard
          card={
            personPosition
          }

          onMove={
            movePerson
          }
        />


        {/* =================================
            CORE CARDS
        ================================= */}

        {cards.map(
          (card) => (
            <DraggableCard
              key={card.id}

              card={card}

              onMove={
                moveCard
              }
            />
          )
        )}


        {/* =================================
            COUNTRY / PROVIDERS
        ================================= */}

        {activeCountryNodes.map(
          (nodes) => (
            <div
              key={
                nodes.countryId
              }
            >

              <DraggableCard
                card={
                  nodes.country
                }

                onMove={(
                  id,
                  x,
                  y
                ) =>
                  moveDynamicNode(
                    nodes.countryId,
                    id,
                    x,
                    y
                  )
                }
              />


              {nodes.providers.map(
                (provider) => (
                  <DraggableCard
                    key={
                      provider.id
                    }

                    card={
                      provider
                    }

                    onMove={(
                      id,
                      x,
                      y
                    ) =>
                      moveDynamicNode(
                        nodes.countryId,
                        id,
                        x,
                        y
                      )
                    }
                  />
                )
              )}

            </div>
          )
        )}

      </div>

    </main>
  );
}


/*
 * =====================================
 * COUNTRY FILTER
 * =====================================
 */

function CountryFilter({
  selectedCountries,
  onToggle,
}) {
  return (
    <aside className="country-filter">

      <div className="country-filter__label">
        IDENTITY PROVIDERS
      </div>


      {Object.values(
        countries
      ).map((country) => {

        const checked =
          selectedCountries.includes(
            country.id
          );


        return (
          <label
            key={country.id}

            className={
              checked
                ? "country-option checked"
                : "country-option"
            }
          >

            <input
              type="checkbox"

              checked={checked}

              onChange={() =>
                onToggle(
                  country.id
                )
              }
            />

            <span className="country-checkbox">
              {checked ? "✓" : ""}
            </span>

            <span>
              {country.name}
            </span>

          </label>
        );
      })}

    </aside>
  );
}