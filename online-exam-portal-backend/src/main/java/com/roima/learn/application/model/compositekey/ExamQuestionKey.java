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

public class ExamQuestionKey implements Serializable {

    @Column(name = "exam_id")
    int examId;

    @Column(name = "question_id")
    int questionId;
}
