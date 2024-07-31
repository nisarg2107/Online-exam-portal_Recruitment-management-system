package com.roima.learn.application.repository;

import com.roima.learn.application.model.Option;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OptionRepository extends JpaRepository<Option, Integer> {
    @Modifying
    @Query("DELETE from Option o WHERE o.question.id = :questionId")
    void deleteByQuestionId(@Param("questionId") int questionId);

//    @Query("SELECT  from Option o WHERE o.question.id = :questionId")
//    boolean existsByQuestionId(@Param("questionId") int questionId);
}
