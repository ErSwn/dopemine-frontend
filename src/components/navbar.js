import React from "react";
import ReactDOM from "react-dom";
import { Switch, Route, BrowserRouter, Link } from "react-router-dom";
import { css } from "emotion";
import { LoremIpsum } from "lorem-ipsum";
import "./styles.css";

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

const items = Array(30)
  .fill()
  .map((_, i) => i);

const listings = {
  ids: items,
  byId: items.reduce((byId, id) => {
    byId[id] = {
      name: lorem.generateWords(3),
      description: lorem.generateParagraphs(20)
    };

    return byId;
  }, {})
};

const Home = () => {
  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      `}
    >
      <div
        className={css`
          background: black;
          color: #fff;
          padding: 1em;
        `}
      >
        Stack App
      </div>
      <div
        className={css`
          overflow: auto;
          -webkit-overflow-scrolling: touch;
        `}
      >
        <div
          className={css`
            max-width: 800px;
            margin: 0 auto;
          `}
        >
          {listings.ids.map(id => (
            <Link
              to={`/${id}`}
              className={css`
                display: block;
                padding: 1em;
                border: 1px solid #000;
                box-shadow: 5px 5px 0 0 #000;
                margin: 1em;
                cursor: pointer;

                &:hover {
                  background: #f1f1f1;
                }
              `}
            >
              {listings.byId[id].name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const Details = ({
  match: {
    params: { id }
  },
  history
}) => {
  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      `}
    >
      <div
        className={css`
          background: white;
          padding: 1em;
          border-bottom: 1px solid black;
        `}
      >
        <div>
          <button
            className={css`
              padding: 1em;
              text-decoration: none;
              color: white;
              margin: 0.5em 0;
              text-align: center;
              box-shadow: 5px 5px 0 0 hotpink;
              background: black;
              border: 0;
              cursor: pointer;

              &:hover {
                background: hotpink;
                box-shadow: 5px 5px 0 0 #000;
              }
            `}
            onClick={() => history.goBack()}
          >
            Back
          </button>
        </div>
      </div>

      <div
        className={css`
          flex-grow: 1;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
        `}
      >
        <div
          className={css`
            max-width: 800px;
            padding: 1em;
            margin: 0 auto;
          `}
        >
          <h1>{listings.byId[id].name} details</h1>
          <p>{listings.byId[id].description}</p>
        </div>
      </div>
      <div
        className={css`
          border-top: 1px solid black;
          width: 100%;
        `}
      >
        <div
          className={css`
            max-width: 800px;
            margin: 0 auto;
            width: 100%;
            display: flex;
            padding: 0 0.5em;
          `}
        >
          <Link
            className={css`
              background: hotpink;
              padding: 1em;
              text-decoration: none;
              color: white;
              width: 100%;
              margin: 0.5em 0;
              text-align: center;
              box-shadow: 5px 5px 0 0 #000;

              &:hover {
                background: black;
                box-shadow: 5px 5px 0 0 hotpink;
              }
            `}
            to={`/${id}/checkout`}
          >
            Buy now
          </Link>
        </div>
      </div>
    </div>
  );
};

const Checkout = ({match: {params: { id }},history
}) => {
	return (
		<div
      className={css`
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      `}
    >
      <div
        className={css`
          background: white;
          padding: 1em;
          border-bottom: 1px solid black;
        `}
      >
        <button
          className={css`
            padding: 1em;
            text-decoration: none;
            color: white;
            margin: 0.5em 0;
            text-align: center;
            box-shadow: 5px 5px 0 0 hotpink;
            background: black;
            border: 0;
            cursor: pointer;

            &:hover {
              background: hotpink;
              box-shadow: 5px 5px 0 0 #000;
            }
          `}
          onClick={() => history.goBack()}
        >
          Close
        </button>
      </div>

      <div
        className={css`
          padding: 1em;
          flex-grow: 1;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
        `}
      >
        <div
          className={css`
            max-width: 800px;
            margin: 0 auto;
          `}
        >
          <h1>Buy the great "{listings.byId[id].name}"</h1>
          <p>Ahhhh... We're out of stock! Check back later</p>
          <p>
            Just kidding. There is no buying options, this is just a demo of
            stack navigation
          </p>
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/:id/checkout" component={Checkout} />
    <Route path="/:id" component={Details} />
  </Switch>
);

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
