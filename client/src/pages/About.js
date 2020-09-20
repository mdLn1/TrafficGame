import React from "react";

function About() {
  return (
    <div className="about-container">
      <h1 style={{ textAlign: "center" }}>About</h1>
      <article>
        <section>
          <h2>The website</h2>
          This is a simple traffic game with different difficulty levels where
          you can select a car, change the road color and compete against other
          players to reach top ten scores for the various difficulty levels; to
          start the game a username is required. You can prevent other users
          from using your chosen username by locking it with a password before
          starting to play; to lock your username you need to click on "Lock my
          username", and provide a good password.
        </section>
        <section>
          <h2>CSS Resources</h2>
          <div>
            <a
              href="https://codepen.io/MichaelArestad/pen/ohLIa"
              target="_blank"
              rel="noopener noreferrer"
            >
              Michael Arestad's pen
            </a>{" "}
            - for input fields
          </div>
          <div>
            <a
              href="https://www.w3schools.com/howto/howto_css_button_split.asp"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3Schools
            </a>{" "}
            - split buttons
          </div>
          <div>
            <a
              href="https://github.com/ConnorAtherton/loaders.css"
              target="_blank"
              rel="noopener noreferrer"
            >
              ConnorAtherton
            </a>{" "}
            - css loaders
          </div>
        </section>
        <section>
          <h2>Image Resources</h2>
          <div>
            <a
              href="https://www.getwaves.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              zcreativelabs
            </a>{" "}
            - background SVGs
          </div>
          <div>
            <a
              target="_blank"
              href="https://pixy.org/1588844/"
              rel="noopener noreferrer"
            >
              Pixy.org
            </a>{" "}
            - crash vector
          </div>
          <div>
            <a
              target="_blank"
              href="https://www.vecteezy.com/"
              rel="noopener noreferrer"
            >
              vecteezy
            </a>{" "}
            - car images
          </div>
          <div>
            <a href="https://www.vecteezy.com/free-vector/car-crash" target="_blank" rel="noopener noreferrer">
              Car Crash Vectors by Vecteezy
            </a>
          </div>
        </section>
      </article>
    </div>
  );
}

export default About;
