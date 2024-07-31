package com.roima.learn.application.service;

import com.roima.learn.application.payload.ExamDto;
import com.roima.learn.application.payload.response.ExamResponseDto;

public interface ExamService {
    ExamResponseDto getExam(int pageNumber, int pageSize);
    ExamDto getExamById(int id);
    ExamDto createExam(ExamDto examDto);
    ExamDto updateExam(int id, ExamDto examDto);
    void deleteExam(int id);

    ExamDto generateExam(ExamDto examDto);

    ExamDto generateExamWithCategory(ExamDto examDto);
}
