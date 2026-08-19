// DraggableCard.jsx

import { useRef } from "react";


export default function DraggableCard({
  card,
  onMove,
}) {
  const dragRef = useRef(null);


  function handlePointerDown(event) {
    if (event.button !== 0) {
      return;
    }


    event.currentTarget.setPointerCapture(
      event.pointerId
    );


    dragRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,

      cardX: card.x,
      cardY: card.y,
    };


    event.currentTarget.classList.add(
      "is-dragging"
    );
  }


  function handlePointerMove(event) {
    if (!dragRef.current) {
      return;
    }


    const drag = dragRef.current;


    const deltaX =
      event.clientX -
      drag.pointerX;


    const deltaY =
      event.clientY -
      drag.pointerY;


    onMove(
      card.id,
      drag.cardX + deltaX,
      drag.cardY + deltaY
    );
  }


  function handlePointerUp(event) {
    dragRef.current = null;


    event.currentTarget.classList.remove(
      "is-dragging"
    );


    try {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    } catch {
      // Pointer capture may already be released.
    }
  }


  return (
    <article
      className={[
        "spatial-card",
        `spatial-card--${card.kind}`,
      ].join(" ")}

      style={{
        left: "50%",
        top: "50%",

        transform:
          `translate3d(
            ${card.x}px,
            ${card.y}px,
            0
          )`,
      }}

      onPointerDown={
        handlePointerDown
      }

      onPointerMove={
        handlePointerMove
      }

      onPointerUp={
        handlePointerUp
      }

      onPointerCancel={
        handlePointerUp
      }
    >

      {/* PERSON */}

      {card.kind === "person" && (
        <>
          <div className="person-icon">
            ◉
          </div>

          <div className="person-label">
            PERSON
          </div>
        </>
      )}


      {/* CORE */}

      {card.kind === "core" && (
        <>
          <div className="spatial-card__number">
            {card.number}
          </div>

          {/* <h2>
            {card.title}
          </h2> */}

          <p>
            {card.description}
          </p>
        </>
      )}


      {/* COUNTRY */}

      {card.kind === "country" && (
        <>
          <div className="spatial-card__type">
            COUNTRY
          </div>

          <h2>
            {card.name}
          </h2>

          <p>
            {card.description}
          </p>
        </>
      )}


      {/* PROVIDER */}

      {card.kind === "provider" && (
        <>
          <div className="spatial-card__type">
            PROVIDER
          </div>

          <h2>
            {card.name}
          </h2>

          <p>
            {card.description}
          </p>
        </>
      )}

    </article>
  );
}