package com.roima.learn.application.repository;

import com.roima.learn.application.model.Exam;
import com.roima.learn.application.model.ExamQuestion;
import com.roima.learn.application.model.Question;
import com.roima.learn.application.model.compositekey.ExamQuestionKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.Set;

public interface ExamQuestionRepository extends JpaRepository<ExamQuestion, ExamQuestionKey> {
    Optional<ExamQuestion> findByIdExamIdAndIdQuestionId(int examId, int questionId);
    Set<Question> findByExamId(int examId);
    Set<Exam> findByQuestionId(int questionId);

    @Modifying
    @Query("DELETE from ExamQuestion eq WHERE eq.exam.id = :examId AND eq.question.id = :questionId")
    void deleteByExamIdAndQuestionId(@Param("examId") int examId, @Param("questionId") int questionId);

}
