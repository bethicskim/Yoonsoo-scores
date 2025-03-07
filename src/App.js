import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceDot } from "recharts";

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

  const calculateDistractionFactor = (time) => {
    if (time <= 0.5) return 1; // No effect if under 30 minutes
    if (time <= 1) return 0.9; // Small impact
    if (time <= 1.5) return 0.7; // Moderate impact
    if (time <= 2) return 0.5; // Significant impact
    return 0.2; // Severe impact if more than 2 hours
  };

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

    let distractionFactor = calculateDistractionFactor(tiktokTime);
    increase1 *= distractionFactor;
    increase2 *= distractionFactor;

    let data = [{ week: 0, [subject1]: s1, [subject2]: s2 }];
    for (let t = 1; t <= weeks; t++) {
      let newS1 = Math.min(s1 + increase1 * t, 100);
      let newS2 = Math.min(s2 + increase2 * t, 100);
      data.push({
        week: t,
        [subject1]: newS1,
        [subject2]: newS2,
      });
    }
    setPredictions(data);
    generateAdvice(increase1, increase2, distractionFactor);
  };

  const generateAdvice = (inc1, inc2, distractionFactor) => {
    let message = "Based on your study plan: ";
    if (inc1 > inc2) {
      message += `Your ${subject1} score will improve faster than ${subject2}. Keep practicing consistently!`;
    } else if (inc2 > inc1) {
      message += `Your ${subject2} score will improve faster than ${subject1}. Stay motivated and don't give up!`;
    } else {
      message += `Both subjects are improving at the same rate. Balance is key!`;
    }
    if (distractionFactor < 1) {
      message += " WARNING: Your TikTok usage is negatively impacting your learning speed. Consider reducing screen time for better results!";
    }
    setAdvice(message);
  };

  return (
    <Card>
      <CardContent>
        <h2>Learning Predictor</h2>
        <p>Enter your current scores, study time, and TikTok usage to see how your progress might change over time!</p>
        <p><b>Understanding the Graph:</b> The x-axis represents the number of weeks, and the y-axis represents your expected score in each subject.</p>
        <p><b>Learning Curve:</b> Learning is not always linear! At first, progress may be slow, but with consistent effort, improvement accelerates before leveling off as mastery is approached.</p>
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
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={predictions}>
            <XAxis dataKey="week" label={{ value: "Weeks", position: "insideBottomRight", offset: -5 }} />
            <YAxis label={{ value: "Score (%)", angle: -90, position: "insideLeft" }} domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <ReferenceDot x={0} y={score1} r={5} fill="#8884d8" />
            <ReferenceDot x={0} y={score2} r={5} fill="#82ca9d" />
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
export default LearningPredictor;
