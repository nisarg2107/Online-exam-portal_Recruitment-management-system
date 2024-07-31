package com.roima.learn.application.service;

import com.roima.learn.application.payload.QuestionDto;
import com.roima.learn.application.payload.response.QuestionResponseDto;

public interface QuestionService {
    QuestionResponseDto getQuestion(int pageNumber, int pageSize);
    QuestionDto getQuestionById(int id);
    QuestionDto createQuestion(QuestionDto questionDto);
    QuestionDto updateQuestion(int id, QuestionDto questionDto);
    void deleteQuestion(int id);
}
