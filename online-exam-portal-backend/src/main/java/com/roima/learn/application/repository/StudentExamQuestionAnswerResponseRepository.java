package com.roima.learn.application.repository;

import com.roima.learn.application.model.StudentExamQuestionAnswerResponse;
import com.roima.learn.application.model.compositekey.StudentExamQuestionAnswerResponseKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.Set;

public interface StudentExamQuestionAnswerResponseRepository extends JpaRepository<StudentExamQuestionAnswerResponse, StudentExamQuestionAnswerResponseKey> {
    Optional<StudentExamQuestionAnswerResponse> findByIdStudentIdAndIdExamIdAndIdQuestionId(int studentId, int examId, int questionId);
    Set<StudentExamQuestionAnswerResponse> findByStudentId(int studentId);
    Set<StudentExamQuestionAnswerResponse> findByStudentIdAndExamId(int studentId, int examId);
    Set<StudentExamQuestionAnswerResponse> findByExamId(int examId);
    Set<StudentExamQuestionAnswerResponse> findByQuestionId(int questionId);

}
