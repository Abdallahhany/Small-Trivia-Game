// This is a Trivia Game component that fetches a random question from an API
// and allows the user to answer it by typing in an input field and submitting.
// The component then displays the result of the user's answer (Correct or Incorrect)
// and shows the correct answer if the user's answer was incorrect.

import React, { useState, useEffect } from "react";
import axios from "axios";

import "./TriviaGame.css";

// Interface defining the shape of the question object fetched from the API
interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

const TriviaGame: React.FC = () => {
  // Define states for question, answer, result, and whether to show the correct answer
  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  // Function to fetch a random question from the API
  const getQuestion = async () => {
    try {
      // Clear the previous question, answer, and result
      clearPrevious();

      // Fetch a random question from the API
      const response = await axios.get("https://opentdb.com/api.php?amount=1");

      // Set the fetched question as the current question state
      setQuestion(response.data.results[0]);

      // Hide the correct answer from the previous question
      setShowAnswer(false);
    } catch (error) {
      // Log any errors that occur during the API call
      console.log(error);
    }
  };

  // Function to handle the submission of the user's answer
  const handleSubmit = () => {
    if (answer.toLowerCase() === question?.correct_answer.toLowerCase()) {
      // If the user's answer is correct, set the result state to "Correct!"
      setResult("Correct!");
    } else {
      // If the user's answer is incorrect, set the result state to "Incorrect!"
      // and show the correct answer
      setResult("Incorrect!");
      setShowAnswer(true);
    }

    // Wait for 3 seconds and then fetch a new question
    setTimeout(() => {
      getQuestion();
    }, 3000);
  };

  // Function to clear the previous question, answer, and result
  const clearPrevious = () => {
    setResult("");
    setAnswer("");
  };

  // useEffect hook to fetch a new question when the component is mounted
  useEffect(() => {
    getQuestion();
  }, []);

  // Render the component
  return (
    <div className="container">
      {question && (
        <>
          {/* Display the category, type, question, and difficulty of the current question */}
          <h3 className="category">{question.category}</h3>
          <p className="quistionType">Type: {question.type}</p>
          <p className="question">{question.question}</p>
          <p className="difficulty">Difficulty: {question.difficulty}</p>
          {/* Display an input field and submit button for the user's answer */}
          <div className="input-container">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <button onClick={handleSubmit}>Submit</button>
          </div>
          {/* Display the result of the user's answer */}
          {result && (
            <p className={`result-${result.toLowerCase()}`.slice(0, -1)}>
              {result}
            </p>
          )}
          {/* Rendering the correct answer if the user answered incorrectly */}
          {showAnswer && (
            <p className="correct-answer">
              The correct answer is: {question.correct_answer}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default TriviaGame;
