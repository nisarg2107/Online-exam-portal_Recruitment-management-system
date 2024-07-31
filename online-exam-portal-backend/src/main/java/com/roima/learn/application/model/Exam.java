package com.roima.learn.application.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import javax.persistence.*;
import java.util.Date;
import java.util.Iterator;
import java.util.Set;

@Entity
@NoArgsConstructor
@AllArgsConstructor
//@Data
@Getter
@Setter
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;

    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern="dd/MM/yyyy")
    private Date createdDate;
    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern="dd/MM/yyyy")
    private Date startDate;
    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern="dd/MM/yyyy")
    private Date endDate;

    private float duration;
    private int passingMarks;

    private float mcqRatio;
    private float notMcqQuestionWeightage;
    private float difficultyRatio;

    private int totalMarks;


    // difficulty
    // end date
    // change date to start date
    // add field create_date
    // is status field added
//    @ManyToMany
//    @JoinTable(
//            name = "exam_category",
//            joinColumns = @JoinColumn(name = "exam_id"),
//            inverseJoinColumns = @JoinColumn(name = "category_id"))
//    private Set<Category> categorySet;

    @OneToMany(mappedBy="exam", targetEntity = StudentExam.class, fetch = FetchType.EAGER)
    private Set<StudentExam> studentExamSet;

    // an exam can have multiple questions
    @OneToMany(mappedBy="exam", targetEntity = ExamQuestion.class, fetch = FetchType.EAGER)
    private Set<ExamQuestion> examQuestionSet;

    @ManyToOne
    @JoinColumn(name="difficulty_id")
    private Difficulty difficulty;

    public void addQuestion(Question question) {
        ExamQuestion examQuestion = new ExamQuestion(this, question);
        examQuestionSet.add(examQuestion);
//        tag.getPosts().add(postTag);
        question.getExamQuestionSet().add(examQuestion);
    }

    public void removeQuestion(Question question) {
        for (Iterator<ExamQuestion> iterator = examQuestionSet.iterator();
             iterator.hasNext(); ) {
            ExamQuestion examQuestion = iterator.next();

            if (examQuestion.getExam().equals(this) &&
                    examQuestion.getQuestion().equals(question)) {
                iterator.remove();
                examQuestion.getQuestion().getExamQuestionSet().remove(examQuestion);
                examQuestion.setQuestion(null);
                examQuestion.setExam(null);
            }
        }
    }
}
