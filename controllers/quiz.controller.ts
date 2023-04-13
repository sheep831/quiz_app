import express from "express";
import sql from "msnodesqlv8";
import { db, debug } from "../config";
import { logger } from "../logger";

export class QuizController {
  constructor() {}

  user_details = async (req: express.Request, res: express.Response) => {
    let query = "EXEC sp_app_get_student_quiz_Header @quiz_guid=?";
    // const quiz_guid = "a29bb697-1f6d-453a-a998-1d15499297cb";
    const quiz_guid = req.params.id;
    try {
      await sql.query(db, query, [quiz_guid], (error, results) => {
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
    const quiz_guid = req.params.id;
    try {
      await sql.query(db, query, [quiz_guid], (error, results) => {
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

  quiz_result = async (req: express.Request, res: express.Response) => {
    try {
      let query =
        "EXEC sp_app_update_question @quiz_guid=?, @idx=?, @time=?, @student_ans=?, @hints=?";
      const quiz_guid = req.body.quiz_guid;
      const time = req.body.time;
      const idx = req.body.idx;
      const student_ans = req.body.student_ans;
      const hints = req.body.hints;
      await sql.query(
        db,
        query,
        [quiz_guid, idx, time, student_ans, hints],
        (error, results) => {
          if (!error) {
            if (debug) {
              res.json(results);
            }
          } else {
            console.log(error);
          }
        }
      );
    } catch (err) {
      logger.error(err);
      res.status(500).send("Internal Server Error");
    }
  };
}
