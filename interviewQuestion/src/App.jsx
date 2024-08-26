import { useState, useEffect } from "react";

const App = () => {
  const [points, setPoints] = useState(0);
  const [done, setDone] = useState(false);
  const [counter, setCounter] = useState(10);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [allPoints, setAllPoints] = useState([]); // Lưu trữ tất cả các điểm
  const [clickedPoints, setClickedPoints] = useState([]); // Lưu trữ các điểm đã bị nhấp
  const [currentIndex, setCurrentIndex] = useState(0); // Trạng thái lưu trữ thứ tự nhấp chuột hiện tại

  useEffect(() => {
    let intervalId;

    if (isGameStarted && counter > 0) {
      intervalId = setInterval(() => {
        setCounter((prevCounter) => prevCounter - 1);
      }, 1000);
    }

    if (counter === 0) {
      setDone(true);
      setIsGameStarted(false);
    }

    return () => clearInterval(intervalId);
  }, [isGameStarted, counter]);

  const handleStartOrRestart = () => {
    if (done) {
      setCounter(10);
      setPoints(0);
      setDone(false);
      setCurrentIndex(0); // Reset lại thứ tự nhấp chuột khi khởi động lại
      setClickedPoints([]); // Reset các điểm đã nhấp
    }

    setIsGameStarted(true);
  };

  const generateRandomPoints = (numPoints) => {
    const pointsArray = [];

    for (let i = 0; i < numPoints; i++) {
      const randomX = Math.floor(Math.random() * 818);
      const randomY = Math.floor(Math.random() * 480);

      pointsArray.push({ x: randomX, y: randomY, index: i });
    }

    setAllPoints(pointsArray); // Lưu trữ tất cả các điểm
  };

  const handlePointsChange = (e) => {
    const value = Number(e.target.value) || 0;
    setPoints(value);
    generateRandomPoints(value);
    setCurrentIndex(0); // Reset lại thứ tự nhấp chuột khi số lượng điểm thay đổi
  };

  const handlePointClick = (index) => {
    if (index === currentIndex) {
      setClickedPoints((prevClickedPoints) => [...prevClickedPoints, index]);
      setCurrentIndex((prevIndex) => prevIndex + 1); // Tăng chỉ số khi nhấp đúng

      if (currentIndex + 1 === points) {
        // Kiểm tra nếu tất cả các điểm đã được nhấp
        setDone(true);
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
        {done ? (
          <h3 style={{ background: "green", display: "inline-block", color: "white" }}>
            All Cleared
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
        <div style={{ display: "flex", gap: "20px", alignItems: "center", marginTop: "-10px" }}>
          <p>Time: </p>
          <p>{counter}s</p>
        </div>
        <button onClick={handleStartOrRestart}>
          {isGameStarted || done ? "Restart" : "Start"}
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
        {allPoints.map((point) => (
          !clickedPoints.includes(point.index) && (
            <div
              key={point.index}
              onClick={() => handlePointClick(point.index)} // Gọi hàm xử lý nhấp chuột khi click vào điểm
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
          )
        ))}
      </div>
    </div>
  );
};

export default App;
