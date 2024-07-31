package com.roima.learn.application.model;

import com.roima.learn.application.model.compositekey.ExamQuestionKey;
import lombok.*;

import javax.persistence.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
//@Data
@Getter
@Setter
public class ExamQuestion {

    @EmbeddedId
    private ExamQuestionKey id;

    // has many exam paper set (A,B,C,D)
    @ManyToOne
    @MapsId("examId")
    @JoinColumn(name="exam_id")
    private Exam exam;

    // has many MCQ and Questions (1,2,3)
    @ManyToOne
    @MapsId("questionId")
    @JoinColumn(name="question_id")
    private Question question;

    private float weightage;

    public ExamQuestion(Exam exam, Question question) {
//        this.weightage = weightage;
        this.exam = exam;
        this.question = question;
        this.id = new ExamQuestionKey(exam.getId(), question.getId());
    }

    public ExamQuestion(Exam exam, Question question, float weightage) {
        this.weightage = weightage;
        this.exam = exam;
        this.question = question;
        this.id = new ExamQuestionKey(exam.getId(), question.getId());
    }
}
