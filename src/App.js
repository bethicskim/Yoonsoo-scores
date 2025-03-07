import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Card = ({ children }) => (
  <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px", margin: "20px 0", background: "#f9f9f9" }}>
    {children}
  </div>
);

const CardContent = ({ children }) => (
  <div style={{ padding: "10px" }}>
    {children}
  </div>
);

const Button = ({ children, onClick }) => (
  <button style={{ padding: "10px", background: "blue", color: "white", borderRadius: "5px", cursor: "pointer", marginTop: "10px" }} onClick={onClick}>
    {children}
  </button>
);

const LearningPredictor = () => {
  const [subject1, setSubject1] = useState("Math");
  const [subject2, setSubject2] = useState("Latin");
  const [score1, setScore1] = useState(95.07);
  const [score2, setScore2] = useState(80);
  const [studyPlan, setStudyPlan] = useState("balanced");
  const [tiktokTime, setTiktokTime] = useState(0);
  const [predictions, setPredictions] = useState([]);
  const [advice, setAdvice] = useState("");

  const calculatePredictions = () => {
    let weeks = 20;
    let s1 = score1;
    let s2 = score2;
    let increase1, increase2;

    if (studyPlan === "more-subject1") {
      increase1 = 1.2;
      increase2 = 0.8;
    } else if (studyPlan === "more-subject2") {
      increase1 = 0.8;
      increase2 = 1.2;
    } else {
      increase1 = 1.0;
      increase2 = 1.0;
    }

    let distractionFactor = Math.max(0, 1 - tiktokTime * 0.05);
    increase1 *= distractionFactor;
    increase2 *= distractionFactor;

    let data = [];
    for (let t = 0; t <= weeks; t++) {
      let curve1 = 100 / (1 + Math.exp(-0.1 * (t - 10)));
      let curve2 = 100 / (1 + Math.exp(-0.2 * (t - 10)));
      data.push({
        week: t,
        [subject1]: Math.min(s1 + increase1 * t, curve1),
        [subject2]: Math.min(s2 + increase2 * t, curve2),
      });
    }
    setPredictions(data);
    generateAdvice(increase1, increase2);
  };

  const generateAdvice = (inc1, inc2) => {
    let message = "Based on your study plan: ";
    if (inc1 > inc2) {
      message += `Your ${subject1} score will improve faster than ${subject2}. Keep practicing consistently!`;
    } else if (inc2 > inc1) {
      message += `Your ${subject2} score will improve faster than ${subject1}. Stay motivated and don't give up!`;
    } else {
      message += `Both subjects are improving at the same rate. Balance is key!`;
    }
    setAdvice(message);
  };

  return (
    <Card>
      <CardContent>
        <h2>Learning Predictor</h2>
        <p>Enter your current scores, study time, and TikTok usage to see how your progress might change over time!</p>
        <label>Subject 1:</label>
        <input type="text" value={subject1} onChange={(e) => setSubject1(e.target.value)} />
        <input type="number" value={score1} onChange={(e) => setScore1(Number(e.target.value))} />
        <label>Subject 2:</label>
        <input type="text" value={subject2} onChange={(e) => setSubject2(e.target.value)} />
        <input type="number" value={score2} onChange={(e) => setScore2(Number(e.target.value))} />
        <label>Study Plan:</label>
        <select onChange={(e) => setStudyPlan(e.target.value)}>
          <option value="balanced">Balanced</option>
          <option value="more-subject1">More {subject1}</option>
          <option value="more-subject2">More {subject2}</option>
        </select>
        <label>Time on TikTok (hours per day):</label>
        <input type="number" value={tiktokTime} onChange={(e) => setTiktokTime(Number(e.target.value))} />
        <Button onClick={calculatePredictions}>Predict</Button>
        <h3>Graph Explanation:</h3>
        <p>The x-axis represents the number of weeks, and the y-axis represents your expected score in each subject.</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={predictions}>
            <XAxis dataKey="week" label={{ value: "Weeks", position: "insideBottomRight", offset: -5 }} />
            <YAxis label={{ value: "Score (%)", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={subject1} stroke="#8884d8" name={subject1} />
            <Line type="monotone" dataKey={subject2} stroke="#82ca9d" name={subject2} />
          </LineChart>
        </ResponsiveContainer>
        <h3>Personalized Advice:</h3>
        <p>{advice}</p>
      </CardContent>
    </Card>
  );
};


