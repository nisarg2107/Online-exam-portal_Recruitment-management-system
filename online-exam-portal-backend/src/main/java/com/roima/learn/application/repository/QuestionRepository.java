package com.roima.learn.application.repository;

import com.roima.learn.application.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Integer> {

    @Query("SELECT o.correct FROM Question q INNER JOIN Option o ON q.id=o.question.id WHERE o.id = :optionId AND o.question.id = :questionId AND o.correct = true")
    boolean findCorrectAnswerOfQuestion(@Param("questionId") int questionId, @Param("optionId") int optionId);

//    @Query("SELECT q FROM Question q WHERE q.difficulty.id = :difficultyId AND mcq = true ORDER BY RAND()\n" +
//            "LIMIT :limit")
//
    @Query(value = "SELECT * FROM question WHERE difficulty_id = :difficultyId AND mcq = true ORDER BY RAND()\n" +
            "LIMIT :limit", nativeQuery = true)
    List<Question> fetchRandomMcqsByDifficulty(@Param("difficultyId") int difficultyId, @Param("limit") int limit);

//    @Query("SELECT q FROM Question q WHERE q.difficulty.id != :difficultyId AND mcq = true ORDER BY RAND()\n" +
//            "LIMIT :limit")

    @Query(value = "SELECT * FROM question WHERE difficulty_id != :difficultyId AND mcq = true ORDER BY RAND()\n" +
        "LIMIT :limit", nativeQuery = true)
    List<Question> fetchRandomMcqsNotByDifficulty(@Param("difficultyId") int difficultyId, @Param("limit") int limit);

//    @Query("SELECT q FROM Question q WHERE q.difficulty.id = :difficultyId AND mcq = false ORDER BY RAND()\n" +
//            "LIMIT :limit")
    @Query(value = "SELECT * FROM question WHERE difficulty_id = :difficultyId AND mcq = false ORDER BY RAND()\n" +
        "LIMIT :limit",nativeQuery = true)
    List<Question> fetchRandomQuestionsByDifficulty(@Param("difficultyId") int difficultyId, @Param("limit") int limit);

//    @Query("SELECT q FROM Question q WHERE q.difficulty.id != :difficultyId AND mcq = false ORDER BY RAND()\n" +
//            "LIMIT :limit")
    @Query(value = "SELECT * FROM question WHERE difficulty_id != :difficultyId AND mcq = false ORDER BY RAND()\n" +
        "LIMIT :limit",nativeQuery = true)
    List<Question> fetchRandomQuestionsNotByDifficulty(@Param("difficultyId") int difficultyId, @Param("limit") int limit);


    // latest changes
    @Query(value = "SELECT * FROM question WHERE difficulty_id = :difficultyId AND category_id = :categoryId ORDER BY RAND()\n" +
            "LIMIT :limit",nativeQuery = true)
    List<Question> fetchRandomQuestionsByDifficultyAndCategory(@Param("difficultyId") int difficultyId, @Param("categoryId") int categoryId, @Param("limit") int limit);

    @Query(value = "SELECT * FROM question WHERE difficulty_id != :difficultyId AND category_id = :categoryId ORDER BY RAND()\n" +
            "LIMIT :limit",nativeQuery = true)
    List<Question> fetchRandomQuestionsNotByDifficultyButByCategory(@Param("difficultyId") int difficultyId, @Param("categoryId") int categoryId, @Param("limit") int limit);

}