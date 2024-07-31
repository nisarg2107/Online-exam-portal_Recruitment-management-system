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
public class StudentExamKey implements Serializable {
    @Column(name = "user_id")
    private int userId;

    @Column(name = "exam_id")
    private int examId;
}
