import express from "express";
import sql from "msnodesqlv8";
import { db, debug } from "../config";

export class QuizController {
  constructor() {}

  user_details = async (req: express.Request, res: express.Response) => {
    let query = "EXEC sp_app_get_student_quiz_Header @quiz_guid=?";
    const quiz_code = "a29bb697-1f6d-453a-a998-1d15499297cb";
    try {
      await sql.query(db, query, [quiz_code], (error, results) => {
        if (!error) {
          if (debug) {
            res.json(results);
          }
        } else {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  quiz_details = async (req: express.Request, res: express.Response) => {
    let query = "EXEC sp_app_get_student_quiz_detail @quiz_guid=?";
    const quiz_code = "a29bb697-1f6d-453a-a998-1d15499297cb";
    try {
      await sql.query(db, query, [quiz_code], (error, results) => {
        if (!error) {
          if (debug) {
            res.json(results);
          }
        } else {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
}
