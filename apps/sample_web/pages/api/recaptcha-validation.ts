import { NextApiRequest, NextApiResponse } from "next";
import qs from "qs";
import axios from "axios";

const googleRecaptchaVerifyUrl = "https://www.google.com/recaptcha/api/siteverify";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.body.recaptchaToken;
  if (!token || !process.env.RECAPTCHA_SECRET_KEY) {
    return res.status(400).json({
      status: "failed",
      message: "Token or Key is invalid",
    });
  }

  const query = qs.stringify({
    secret: process.env.RECAPTCHA_SECRET_KEY,
    response: token,
  });

  try {
    const verificationRes = (await axios.post(`${googleRecaptchaVerifyUrl}?${query}`)).data;
    if (verificationRes?.score > 0.5) {
      res.status(200).json({
        status: "successful",
        message: "Validation succeeded as human",
      });
    } else {
      res.status(200).json({
        status: "failed",
        message: "Validation failed as bot",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: "Sorry something went wrong",
    });
  }
}
