package com.roima.learn.application.service;

import com.roima.learn.application.payload.StudentExamQuestionAnswerResponseDto;
import com.roima.learn.application.payload.response.StudentExamQuestionResponseDto;
import com.roima.learn.application.payload.simple.SimpleStudentExamResponseDto;

import java.util.Set;

public interface StudentExamQuestionAnswerResponseService {
    StudentExamQuestionResponseDto getStudentExamQuestionAnswerResponse(int pageNumber, int pageSize);
    StudentExamQuestionAnswerResponseDto getStudentExamQuestionAnswerResponseById(int studentId, int examId, int questionId);

    Set<StudentExamQuestionAnswerResponseDto> getStudentExamQuestionAnswerResponseByStudentId(int studentId);
    Set<StudentExamQuestionAnswerResponseDto> getStudentExamQuestionAnswerResponseByExamId(int examId);
    Set<StudentExamQuestionAnswerResponseDto> getStudentExamQuestionAnswerResponseByQuestionId(int questionId);

    Set<SimpleStudentExamResponseDto> getStudentExamQuestionAnswerResponseByStudentIdAndExamId(int studentId, int examId);


    StudentExamQuestionAnswerResponseDto createStudentExamQuestionAnswerResponse(int studentId, int examId,int questionId, StudentExamQuestionAnswerResponseDto studentExamQuestionAnswerResponseDto);
    StudentExamQuestionAnswerResponseDto updateStudentExamQuestionAnswerResponse(int studentId, int examId, int questionId, StudentExamQuestionAnswerResponseDto studentExamQuestionAnswerResponseDto);
    StudentExamQuestionAnswerResponseDto checkStudentExamQuestionAnswerManual(int studentId, int examId, int questionId, int marks);
    Set<StudentExamQuestionAnswerResponseDto> checkStudentExamQuestionAnswerAutomatic(int studentId, int examId);

    void deleteStudentExamQuestionAnswerResponse(int studentId, int examId, int questionId);
}
