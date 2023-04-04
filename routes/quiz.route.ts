import express from "express";
import { QuizController } from "../controllers/quiz.controller";

export default function quizRoutes(quizController: QuizController) {
  const quizRoutes = express.Router();

  quizRoutes.get("/user/details", quizController.user_details);
  quizRoutes.get("/quiz/details", quizController.quiz_details);

  return quizRoutes;
}
