package com.roima.learn.application.service;

import com.roima.learn.application.payload.ExamDto;
import com.roima.learn.application.payload.StudentExamDto;
import com.roima.learn.application.payload.UserDto;
import com.roima.learn.application.payload.response.StudentExamResponseDto;

import java.util.Set;

public interface StudentExamService {
    StudentExamResponseDto getStudentExam(int pageNumber, int pageSize);

    StudentExamDto getStudentExamById(int studentId, int examId);
    Set<ExamDto> getExamByStudentId(int studentId);
    Set<UserDto> getStudentByExamId(int examId);

    StudentExamDto createStudentExam(int studentId, int examId, StudentExamDto studentExamDto);
    StudentExamDto updateStudentExam(int studentId, int examId, StudentExamDto studentExamDto);
    StudentExamDto updateStudentExamStatus(int studentId, int examId, StudentExamDto studentExamDto);

    void deleteStudentExam(int studentId, int examId);
}
