// Connections.jsx

export default function Connections({
  cards,
  person,
  activeCountry,
  countryNodes,
}) {
  const lines = [];


  /*
   * PERSON → CORE CARDS
   */

  cards.forEach((card) => {
    lines.push({
      id:
        `person-${card.id}`,

      x1: person.x,
      y1: person.y,

      x2: card.x,
      y2: card.y,

      type: "core",
    });
  });


  /*
   * IDENTITY → COUNTRY
   */

  if (
    activeCountry &&
    countryNodes
  ) {
    lines.push({
      id:
        `identity-${activeCountry.id}`,

      x1:
        countryNodes.identity.x,

      y1:
        countryNodes.identity.y,

      x2:
        countryNodes.country.x,

      y2:
        countryNodes.country.y,

      type: "country",
    });


    /*
     * COUNTRY → PROVIDERS
     */

    countryNodes.providers.forEach(
      (provider) => {
        lines.push({
          id:
            `${activeCountry.id}-${provider.id}`,

          x1:
            countryNodes.country.x,

          y1:
            countryNodes.country.y,

          x2:
            provider.x,

          y2:
            provider.y,

          type: "provider",
        });
      }
    );
  }


  return (
    <svg
      className="spatial-connections"
      aria-hidden="true"
    >

      {lines.map((line) => (
        <Connection
          key={line.id}
          {...line}
        />
      ))}

    </svg>
  );
}


function Connection({
  x1,
  y1,
  x2,
  y2,
  type,
}) {
  const distance =
    Math.abs(x2 - x1);


  const curve =
    Math.max(
      distance * 0.35,
      45
    );


  const path = `
    M ${x1} ${y1}

    C
      ${x1 + curve} ${y1},
      ${x2 - curve} ${y2},
      ${x2} ${y2}
  `;


  return (
    <path
      d={path}
      className={[
        "spatial-connection",
        `spatial-connection--${type}`,
      ].join(" ")}
    />
  );
}