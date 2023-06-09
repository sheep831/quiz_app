import express from "express";
import { QuizController } from "../controllers/quiz.controller";

export default function quizRoutes(quizController: QuizController) {
  const quizRoutes = express.Router();

  quizRoutes.get("/user/details/:id", quizController.user_details);
  quizRoutes.get("/quiz/details/:id", quizController.quiz_details);
  quizRoutes.put("/quiz/result", quizController.quiz_result);
  quizRoutes.get("/quiz/next/:studentId/quiz", quizController.next_quiz);

  return quizRoutes;
}
