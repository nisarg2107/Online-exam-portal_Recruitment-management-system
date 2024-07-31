package com.roima.learn.application.model.compositekey;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
public class StudentExamQuestionAnswerResponseKey implements Serializable {
    @Column(name = "student_id")
    private int studentId;

    @Column(name = "exam_id")
    private int examId;

    @Column(name = "question_id")
    private int questionId;
}
