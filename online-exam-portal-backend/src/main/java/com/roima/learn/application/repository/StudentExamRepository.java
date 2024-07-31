package com.roima.learn.application.repository;

import com.roima.learn.application.model.Exam;
import com.roima.learn.application.model.StudentExam;
import com.roima.learn.application.model.User;
import com.roima.learn.application.model.compositekey.StudentExamKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.Set;

public interface StudentExamRepository extends JpaRepository<StudentExam, StudentExamKey> {
    Optional<StudentExam> findByIdUserIdAndIdExamId(int userId, int examId);
    Set<User> findByExamId(int examId);
    Set<Exam> findByUserId(int studentId);

    @Modifying
    @Query("DELETE from StudentExam se WHERE se.exam.id = :examId AND se.user.id = :userId")
    void deleteByIdUserIdAndIdExamId(@Param("userId") int userId, @Param("examId") int examId);
}
