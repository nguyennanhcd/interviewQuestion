import { useState, useEffect } from "react";

const App = () => {
  const [points, setPoints] = useState(0);
  const [status, setStatus] = useState("notStarted"); // Replacing done with status
  const [counter, setCounter] = useState(10);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [allPoints, setAllPoints] = useState([]);
  const [clickedPoints, setClickedPoints] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let intervalId;

    if (isGameStarted && counter > 0) {
      intervalId = setInterval(() => {
        setCounter((prevCounter) => prevCounter - 1);
      }, 1000);
    }

    if (counter === 0) {
      if (clickedPoints.length === points) {
        setStatus("All Cleared");
      } else {
        setStatus("You failed");
      }
      setIsGameStarted(false);
    }

    return () => clearInterval(intervalId);
  }, [isGameStarted, counter, clickedPoints, points]);

  const handleStartOrRestart = () => {
    setCounter(10);
    setPoints(0);
    setStatus("notStarted");
    setCurrentIndex(0);
    setClickedPoints([]);
    setIsGameStarted(true);
  };

  const generateRandomPoints = (numPoints) => {
    const pointsArray = [];
    const pointSize = 20; // Assuming each point is 20x20 pixels in size
    const maxX = 818;
    const maxY = 480;

    for (let i = 0; i < numPoints; i++) {
      let randomX, randomY, isOverlapping;
      do {
        randomX = Math.floor(Math.random() * (maxX - pointSize));
        randomY = Math.floor(Math.random() * (maxY - pointSize));
        isOverlapping = pointsArray.some(
          (point) =>
            Math.abs(point.x - randomX) < pointSize &&
            Math.abs(point.y - randomY) < pointSize
        );
      } while (isOverlapping);

      pointsArray.push({ x: randomX, y: randomY, index: i });
    }

    setAllPoints(pointsArray);
  };

  const handlePointsChange = (e) => {
    const value = Number(e.target.value) || 0;
    setPoints(value);
    generateRandomPoints(value);
    setCurrentIndex(0);
  };

  const handlePointClick = (index) => {
    if (!isGameStarted) {
      setIsGameStarted(true)  
    }
    if (index === currentIndex) {
      setClickedPoints((prevClickedPoints) => [...prevClickedPoints, index]);
      setCurrentIndex((prevIndex) => prevIndex + 1);
      if (currentIndex + 1 === points) {
        setStatus("All Cleared");
        setIsGameStarted(false);
      }
    }
  };

  return (
    <div
      style={{
        border: "1px solid black",
        height: "80%",
        width: "50%",
        margin: "0 auto",
        padding: "0 20px 0 20px",
        display: "flex",
        flexDirection: "column",
        borderRadius: "10px",
      }}
    >
      <div>
        {status === "All Cleared" ? (
          <h3
            style={{ background: "green", display: "inline-block", color: "white" }}
          >
            All Cleared
          </h3>
        ) : status === "You failed" ? (
          <h3
            style={{ background: "red", display: "inline-block", color: "white" }}
          >
            You failed
          </h3>
        ) : (
          <h3>Let's play</h3>
        )}
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <p>Points: </p>
          <input
            type="text"
            style={{ height: "10px" }}
            value={points}
            onChange={handlePointsChange}
            disabled={isGameStarted}
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "center",
            marginTop: "-10px",
          }}
        >
          <p>Time: </p>
          <p>{counter}s</p>
        </div>
        <button onClick={handleStartOrRestart}>
          {isGameStarted || status !== "notStarted" ? "Restart" : "Start"}
        </button>
      </div>
      <div
        style={{
          margin: "20px 0 20px 0",
          height: "500px",
          width: "100%",
          border: "1px solid black",
          position: "relative",
        }}
      >
        {allPoints.map((point) =>
          !clickedPoints.includes(point.index) ? (
            <div
              key={point.index}
              onClick={() => handlePointClick(point.index)}
              style={{
                position: "absolute",
                top: `${point.y}px`,
                left: `${point.x}px`,
                width: "20px",
                height: "20px",
                backgroundColor: "transparent",
                borderRadius: "50%",
                border: "1px solid black",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p>{point.index + 1}</p>
            </div>
          ) : (
            <div
              key={point.index}
              style={{
                position: "absolute",
                top: `${point.y}px`,
                left: `${point.x}px`,
                width: "20px",
                height: "20px",
                backgroundColor: "red",
                borderRadius: "50%",
                border: "1px solid black",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p>{point.index + 1}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default App;
