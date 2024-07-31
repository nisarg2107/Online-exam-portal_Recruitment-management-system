import { configureStore } from "@reduxjs/toolkit";
import userDetail from "../features/userDetailSlice";
import questionDetail from "../features/questionDetailSlice";
import categoryDetail from "../features/categoryDetailSlice";
import difficultyDetail from "../features/difficultyDetailSlice";
import authDetails from "../features/authDetailSlice";
import roleDetail from "../features/roleDetailSlice";
import examDetail from "../features/examDetailSlice";
import userExamDetail from "../features/userExamDetailSlice";
import examQuestionResponseDetail from "../features/examQuestionResponseDetailSlice";

export const store = configureStore({
    reducer: {
        users: userDetail,
        examResponse: examQuestionResponseDetail,
        userExam: userExamDetail,
        exams: examDetail,
        questions: questionDetail,
        categories: categoryDetail,
        difficulty: difficultyDetail,
        roles: roleDetail,
        jwt: authDetails
    },
});