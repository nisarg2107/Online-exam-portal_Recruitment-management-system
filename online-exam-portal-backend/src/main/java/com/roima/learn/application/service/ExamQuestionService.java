package com.roima.learn.application.service;

import com.roima.learn.application.payload.ExamDto;
import com.roima.learn.application.payload.ExamQuestionDto;
import com.roima.learn.application.payload.QuestionDto;
import com.roima.learn.application.payload.response.ExamQuestionResponseDto;

import java.util.Set;

public interface ExamQuestionService {
    ExamQuestionResponseDto getExamQuestion(int pageNumber, int pageSize);

    ExamQuestionDto getExamQuestionById(int examId, int questionId);
    Set<QuestionDto> getExamQuestionByExamId(int examId);
    Set<ExamDto> getExamQuestionByQuestionId(int questionId);

    ExamQuestionDto createExamQuestion(int examId, int questionId, ExamQuestionDto examQuestionDto);
    ExamQuestionDto updateExamQuestion(int examId, int questionId, ExamQuestionDto examQuestionDto);

    void deleteExamQuestion(int examId, int questionId);

    // the below might not be working
    Set<QuestionDto> batchAddQuestions(int examId, Set<QuestionDto> questionDtoSet);
}
