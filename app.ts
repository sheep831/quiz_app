// -------------------------------------------------------------------------------------------------------------------
// imports (DO NOT EXPORT ANYTHING FORM App.ts)
// -------------------------------------------------------------------------------------------------------------------
import express from "express";
import { QuizController } from "./controllers/quiz.controller";
import { logger } from "./logger";
import quizRoutes from "./routes/quiz.route";
// -------------------------------------------------------------------------------------------------------------------
// main script
// -------------------------------------------------------------------------------------------------------------------
const app = express();

// -------------------------------------------------------------------------------------------------------------------
// others
// -------------------------------------------------------------------------------------------------------------------

//urlencoded
app.use(express.urlencoded({ extended: true }));

//json
app.use(express.json());

//get files from public, default images & uploads
app.use(express.static("public"));
// app.use('/serverDefaultedImages', express.static('images'))
// app.use('/userUploadedFiles', express.static('uploads'))

// --------------------------------------------------------------------------------------------------------------------
// Router
//---------------------------------------------------------------------------------------------------------------------
const quizController = new QuizController();

app.use(quizRoutes(quizController));

// --------------------------------------------------------------------------------------------------------------------
// listening
//---------------------------------------------------------------------------------------------------------------------
app.listen(8000, () => {
  logger.info("listening on port 8000");
});
