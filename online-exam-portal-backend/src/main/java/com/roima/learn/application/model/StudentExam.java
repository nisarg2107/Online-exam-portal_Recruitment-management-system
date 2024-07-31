package com.roima.learn.application.model;

import com.roima.learn.application.model.compositekey.StudentExamKey;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
//@Data
@Getter
@Setter
public class StudentExam {

    @EmbeddedId
    private StudentExamKey id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name="user_id")
    private User user;

    @ManyToOne
    @MapsId("examId")
    @JoinColumn(name="exam_id")
    private Exam exam;

    private int marks;
    private boolean passed;
    private String ipAddress;
    private String macAddress;
    private boolean submitted;

    private String status = "pending";

    public StudentExam(User user, Exam exam) {
        this.user = user;
        this.exam = exam;
        this.id = new StudentExamKey(user.getId(), exam.getId());
    }
}
