package com.roima.learn.application.model;

import com.roima.learn.application.model.compositekey.StudentExamQuestionAnswerResponseKey;
import lombok.*;

import javax.persistence.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
//@Data
@Getter
@Setter
public class StudentExamQuestionAnswerResponse {

    @EmbeddedId
    private StudentExamQuestionAnswerResponseKey id;

    // Bi-direction as student can view his response
    @ManyToOne
    @MapsId("studentId")
    @JoinColumn(name= "student_id")
    private User student;

    // other fields don't need bidirectional flow
    @ManyToOne
    @MapsId("examId")
    @JoinColumn(name= "exam_id")
    private Exam exam;

    @ManyToOne
    @MapsId("questionId")
    @JoinColumn(name= "question_id")
    private Question question;

    @ManyToOne
    @JoinColumn(name= "selected_option_id")
    private Option selectedOption;

    @Column
    private String answer;

    private boolean selectedOptionCorrect;
    private boolean checked = false;
    private int obtainedMarks = 0;

    // can add time for the question the student took time for
}
